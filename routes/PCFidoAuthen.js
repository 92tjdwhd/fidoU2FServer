const express = require("express");
const fidoService = require("../src/fidoService");
const router = express.Router();
const logger = require("../src/logger");
const fidoDB = require("../src/DB/fidoUserDB");
const ResData = require("../src/ResponseFormat");
const jwt = require("../src/jwt/jwt")
const status = require("../src/value/statusCode")

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Express" });  
});

router.post("/request/register", async (req, res) => {
  let responseResult;
  let challenge;
  let reqData = req.body;
  let userId = reqData.userId;
  let isRegistered = await fidoDB.isRegistration(userId);
  let userRegisterData = await fidoDB.getUserRegisterData(userId);

  if(await fidoDB.isUserStatus(userId)){       
    if (isRegistered) {
      if (userRegisterData.publicKey === " ") {
        challenge = fidoService.startReg();
        if (challenge){
          logger.userInfoLog(userId,"registration","request","success",status.RESULT_OK.status,req.ip)
          console.log(responseResult);
          res.json(ResData.setResultOK(challenge, "reg"));
        }
     } else {
      logger.userInfoLog(userId,"registration","request","failure",status.REGISTERED_USERID.status,req.ip)
      res.json(ResData.setResultErr("reg",status.REGISTERED_USERID.status,status.REGISTERED_USERID.msg));
     }
    } else {
      let createdUser = await fidoDB.createUser(userId);
      if (createdUser) {
        challenge = fidoService.startReg();
        if (challenge) {
          logger.userInfoLog(userId,"registration","request","success",status.RESULT_OK.status,req.ip)
          res.json(ResData.setResultOK(challenge, "reg","",false));
          console.log("resData : ", ResData.setResultOK(challenge, "reg"))
        } else { 
          logger.userErrLog(userId,"registration","request","failure",status.INTERNAL_SERVER_ERROR.status,req.ip)
          res.json(ResData.setResultErr("reg",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
        }
      }
    }
  }else{
    logger.userInfoLog(userId,"registration","request","failure",status.REGISTERED_USERID.status,req.ip)
    res.json(ResData.setResultErr("reg",status.REGISTERED_USERID.status,status.REGISTERED_USERID.msg));
  }
});

router.post("/response/register", async (req, res) => {
  let responseResult;
  let registration;
  let reqData = req.body;
  let userId = reqData.userId;
  let challenge = JSON.parse(reqData.challenge);
  let deviceResponse = JSON.parse(reqData.deviceResponse);
  console.log("userId: ", userId);
  console.log("challenge: ", challenge);
  console.log("deviceResponse: ", deviceResponse);
  try {
    registration = fidoService.finishReg(
      challenge,
      deviceResponse
    );
    if (registration) {
      let publicKey = registration.publicKey;
      let keyHandle = registration.keyHandle;
      let certificate = registration.certificate;
      let addRegistration = await fidoDB.addRegistration(
        userId,
        publicKey,
        keyHandle,
        certificate
      );
      if (addRegistration) {
        logger.userInfoLog(userId,"registration","response","success",status.RESULT_OK.status,req.ip)
        res.json(ResData.setResultOK({userId:userId}, "reg"));
      } else {
        responseResult = ResData.result_Register_failded; 
        logger.userErrLog(userId,"registration","response","failure",status.REGISTER_FAILDED.status,req.ip)
        res.json(ResData.setResultErr("reg",status.REGISTER_FAILDED.status,status.REGISTER_FAILDED.msg));
      }
    } else {
      responseResult = ResData.result_Register_failded; 
        logger.userErrLog(userId,"registration","response","failure",status.REGISTER_FAILDED.status,req.ip)
        res.json(ResData.setResultErr("reg",status.REGISTER_FAILDED.status,status.REGISTER_FAILDED.msg));
    }
  } catch (err) {
    responseResult = ResData.result_INTERNAL_SERVER_ERROR;
    logger.userErrLog(userId,"registration","response","failure",status.INTERNAL_SERVER_ERROR.status,req.ip)
    res.json(ResData.setResultErr("reg",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
  }
});

router.post("/request/authen", async (req, res) => {
  let challenge;
  let reqData = req.body;
  let userId = reqData.userId;
  let userRegisterData = await fidoDB.getUserRegisterData(userId);
  if(await fidoDB.isUserStatus(userId)){       
    if (userRegisterData) {
        challenge = fidoService.startAuth(
          userRegisterData,
        );
        if (challenge) {
          logger.userInfoLog(userId,"authentication","request","success",status.RESULT_OK.status,req.ip)
          res.json(ResData.setResultOK(challenge, "auth"));
        } else {
          logger.userErrLog(userId,"authentication","request","failure",status.INTERNAL_SERVER_ERROR.status,req.ip)
          res.json(ResData.setResultErr("auth",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
        }
      } else {
          logger.userErrLog(userId,"authentication","request","failure",status.UNKNOWN_KEYID.status,req.ip)
          res.json(ResData.setResultErr("auth",status.UNKNOWN_KEYID.status,status.UNKNOWN_KEYID.msg));
      }
  }else{
    logger.userErrLog(userId,"authentication","request","failure",status.UNKNOWN_USERID.status,req.ip)
    res.json(ResData.setResultErr("auth",status.UNKNOWN_USERID.status,status.UNKNOWN_USERID.msg));
  }
});

router.post("/response/authen", async (req, res) => {
  let authentication;
  let reqData = req.body;
  let userId = reqData.userId;
  let challenge = JSON.parse(reqData.challenge);
  let deviceResponse = JSON.parse(reqData.deviceResponse);
  try {
    let deviceRegistration = await fidoDB.getUserRegisterData(userId);
    authentication = fidoService.finishAuth(
      challenge,
      deviceResponse,
      deviceRegistration
    );
    console.log(authentication.counter);
    if (authentication) {
      if (authentication.counter >= (await fidoDB.getUserAuthenCount(userId))) {
        fidoDB.updateUserAuthenCount(userId, authentication.counter);
        console.log(authentication.counter);
        logger.userInfoLog(userId,"authentication","response","success",status.RESULT_OK.status,req.ip)
        res.json(ResData.setResultOK({userId:userId}, "auth",jwt.createUserJWT(userId),false));
      } else {
        logger.userErrLog(userId,"authentication","response","failure",status.REQUEST_INVALID.status,req.ip)
        res.json(ResData.setResultErr("auth",status.REQUEST_INVALID.status,status.REQUEST_INVALID.msg));
      }
    } else {      
      logger.userErrLog(userId,"authentication","response","failure",status.AUTHENTICATION_FAILDED.status,req.ip)
      res.json(ResData.setResultErr("auth",status.AUTHENTICATION_FAILDED.status,status.AUTHENTICATION_FAILDED.msg));
    }
  } catch (err) {
    logger.userErrLog(userId,"authentication","response","failure",status.INTERNAL_SERVER_ERROR.status,req.ip)
    res.json(ResData.setResultErr("auth",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
  }
});

router.post("/response/deregister", async (req, res) => {
  let reqData = req.body;
  let userId = reqData.userId;
  let deleteUserResult = await fidoDB.setDisableUserStatus(userId)
  try {
    if(deleteUserResult){
        logger.userInfoLog(userId,"deregistration","response","success",status.RESULT_OK.status,req.ip)
        res.json(ResData.setResultOK({userId:userId},"dReg"));
      }else{
        logger.userErrLog(userId,"deregistration","response","failure",status.UNKNOWN_USERID.status,req.ip)
        res.json(ResData.setResultErr("dReg",status.UNKNOWN_USERID.status,status.UNKNOWN_USERID.msg));
      }
    }catch(err) {
      logger.userErrLog(userId,"deregistration","response","failure",status.DELETEREGISTER_FAILDED.status,req.ip)
      res.json(ResData.setResultErr("dReg",status.DELETEREGISTER_FAILDED.status,status.DELETEREGISTER_FAILDED.msg));  
    }
})

module.exports = router;
