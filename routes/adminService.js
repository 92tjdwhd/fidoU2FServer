const express = require("express");
const router = express.Router();
const logger = require("../src/logger");
const ResData = require("../src/ResponseFormat");
const fidoService = require("../src/fidoService");
const adminsDB = require("../src/DB/adminDB")
const jwt = require("../src/jwt/jwt")
const status = require("../src/value/statusCode")

require('date-utils');

router.post("/delete-user", async (req, res) => {
  let reqData = req.body;
  let userId = reqData.userId;
  let adminId = reqData.adminId;
  let adminPw = reqData.adminPw
  let description  =" The administrator "+adminId+" has requested to delete the user "+userId
  let checkpassword = await adminsDB.checkPassword(adminId,adminPw)
  let deleteUserResult
  if(await adminsDB.isSuperAdmin(adminId)){ 
    if(await adminsDB.isLock(adminId)){      
      if(checkpassword){
        deleteUserResult = await fidoService.deleteReg(userId);  
        try {    
          if(deleteUserResult){
              logger.adminInfoLog(adminId,"deleteUser","success",status.RESULT_OK.status,req.ip,description,userId)
              res.json(ResData.setResultOK(null,"dReg",jwt.createAdminJWT(reqData.adminId),true));
            }else{
              logger.adminErrLog(adminId,"deleteUser","failure",status.UNKNOWN_USERID.status,req.ip,description,userId)
              res.json(ResData.setResultErr("dReg",status.UNKNOWN_USERID.status,status.UNKNOWN_USERID.msg));
            }
          }catch(err) {
            logger.adminErrLog(adminId,"deleteUser","failure",status.DELETEREGISTER_FAILDED.status,req.ip,description,userId)
            res.json(ResData.setResultErr("dReg",status.DELETEREGISTER_FAILDED.status,status.DELETEREGISTER_FAILDED.msg));  
          }
        }else{
          logger.adminErrLog(adminId,"deleteUser","failure",status.INVALID_PASSWORD.status,req.ip,description,userId)
          res.json(ResData.setResultErr("dReg",status.INVALID_PASSWORD.status,status.INVALID_PASSWORD.msg));
        } 
      }else{
        logger.adminErrLog(adminId,"deleteUser","failure",status.NO_PERMISSION.status,req.ip,description,userId)
        res.json(ResData.setResultErr("dReg",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
      }
    }else{
      logger.adminErrLog(adminId,"deleteUser","failure",status.NO_PERMISSION.status,req.ip,description,userId)
      res.json(ResData.setResultErr("dReg",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
    }
    
  });

router.post("/add-admin", async (req, res) => {
    let reqData = req.body;   
    let adminId = reqData.adminId;
    let addAdminId = reqData.addAdminId;
    let addAdminPw = reqData.addAdminPw;
    let addAdminName = reqData.addAdminName;
    let addAdminEmail = reqData.addAdminEmail;
    let description  = "The administrator "+adminId+" has requested to add the user "+addAdminId+" as administrator."
    if(await adminsDB.isSuperAdmin(adminId)){
    let result = await adminsDB.addAdmin(addAdminId,addAdminPw,addAdminName,addAdminEmail);
    if(result && result !== "exist"){
      logger.adminInfoLog(adminId,"addAdmin","success",status.RESULT_OK.status,req.ip,description,addAdminId)
      res.json(ResData.setResultOK(null, "addAdmin",jwt.createAdminJWT(adminId),true));
    }else if(result === "exist"){
      logger.adminErrLog(adminId,"addAdmin","failure",status.REGISTERED_ADMIN.status,req.ip,description,addAdminId)
      res.json(ResData.setResultErr("addAdmin",status.REGISTERED_ADMIN.status,status.REGISTERED_ADMIN.msg));
    }else{
      logger.adminErrLog(adminId,"addAdmin","failure",status.CREATE_FAILDED.status,req.ip,description,addAdminId)
      res.json(ResData.setResultErr("addAdmin",status.CREATE_FAILDED.status,status.CREATE_FAILDED.msg));
    }
  }else{
    logger.adminErrLog(adminId,"addAdmin","failure",status.NO_PERMISSION.status,req.ip,description,addAdminId)
    res.json(ResData.setResultErr("addAdmin",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
  }
})

router.post("/get-user-info", async (req, res) => {
  let reqData = req.body;  
  let userId = reqData.userId;
  let adminId = reqData.adminId;
  let description;
  let result;

  if(await adminsDB.getAdminID(adminId)){
    if(userId){
     result = await adminsDB.findUser(userId)
     description=  "Administrator "+adminId+" has requested information from your "+userId
    }else{
      result = await adminsDB.findAllUsers()
      description  = "Administrator "+adminId+" has requested all user information."
    }  
    if(result){
     res.json(ResData.setResultOK(result,"getUserInfo",jwt.createAdminJWT(adminId),true));
    }else{
     res.json(ResData.setResultErr("getUserInfo",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
    }
  }else{
    res.json(ResData.setResultErr("getUserInfo",status.NOT_REGISTERED_ADMIN.status,status.NOT_REGISTERED_ADMIN.msg));
  }
})

router.post("/edit-admin-info", async (req, res) => {
  let reqData = req.body;
  let adminId = reqData.adminId;
  let editAdminId = reqData.editAdminId
  let editAdminPw = reqData.editAdminPw; 
  let editAdminName = reqData.editAdminName
  let editAdminEmail = reqData.editAdminEmail
  let adminPw = reqData.adminPw;
  let editAdminIsLocked = reqData.editAdminIsLocked
  let description  = "Administrator "+adminId+" has requested to modify manager "+editAdminId+" information."
  let permisson = true
  let checkpassword = await adminsDB.checkPassword(adminId,adminPw)
  let destId = "";
  if( !await adminsDB.isSuperAdmin(adminId)){
      if(adminId == editAdminId && ! editAdminIsLocked !== null && editAdminIsLocked !== ""){
        permisson = true
        editAdminIsLocked =""
        destId = adminId
      }else{
        permisson = false
      }
    } 
  if(permisson){
    if(await adminsDB.isLock(adminId)){
        if(checkpassword){
          let result
          if(await adminsDB.getAdminID(editAdminId)){
          result = await adminsDB.updateAdminInfo(editAdminId,editAdminName,editAdminEmail,editAdminPw,editAdminIsLocked);
          }else{
            result = false;
          }     
      if(result){
          logger.adminInfoLog(adminId,"editAdminInfo","success",status.RESULT_OK.status,req.ip,description,destId)
          res.json(ResData.setResultOK(null, "editAdminInfo",jwt.createAdminJWT(adminId),true));  
      }else{
          logger.adminErrLog(adminId,"editAdminInfo","failure",status.NOT_REGISTERED_ADMIN.status,req.ip,description,destId)
          res.json(ResData.setResultErr("editAdminInfo",status.NOT_REGISTERED_ADMIN.status,status.NOT_REGISTERED_ADMIN.msg));
        }
      }else{
      logger.adminInfoLog(adminId,"editAdminInfo","failure",status.INVALID_PASSWORD.status,req.ip,description,destId)
        res.json(ResData.setResultErr("editAdminInfo",status.INVALID_PASSWORD.status,status.INVALID_PASSWORD.msg)); 
      }
    }else{
      logger.adminErrLog(adminId,"editAdminInfo","failure",status.NO_PERMISSION.status,req.ip,description,destId)
      res.json(ResData.setResultErr("editAdminInfo",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
    }
  }else{
    logger.adminErrLog(adminId,"editAdminInfo","failure",status.ACCOUNT_LOCKOUT.status,req.ip,description,adminId)
    res.json(ResData.setResultErr("editAdminInfo",status.ACCOUNT_LOCKOUT.status,status.ACCOUNT_LOCKOUT.msg))
  }
})

/*
router.post("/changePassword", async (req, res) => {
  let reqData = req.body;
  let adminId = reqData.adminId
  let editAdmin = reqData.editAdmin;
  let nPassword = reqData.nPassword; 
  let cPassword = reqData.cPassword;
  let description  = "The administrator "+adminId+" has requested a password change for the administrator "+editAdmin
  if(await adminsDB.isSuperAdmin(adminId)){
  let result =  await adminsDB.changePassword(editAdmin,cPassword,nPassword);
  if(result && result !== "failure"){
    logger.adminInfoLog(adminId,"changePassword","success",status.RESULT_OK.status,req.ip,description)
    res.json(ResData.setResultOK(null, "cPass",jwt.createAdminJWT(reqData.adminId),true));
  }else if(result == 'failure'){
    logger.adminInfoLog(adminId,"changePassword","failure",status.INCORRECT_PASSWORD.status,req.ip,description)
    res.json(ResData.setResultErr("changePassword",status.INCORRECT_PASSWORD.status,status.INCORRECT_PASSWORD.msg));  
  }else{
    logger.adminErrLog(adminId,"changePassword","failure",status.BAD_REQUEST.status,req.ip,description)
    res.json(ResData.setResultErr("changePassword",status.BAD_REQUEST.status,status.BAD_REQUEST.msg));
  } 
}else{
    logger.adminErrLog(adminId,"changePassword","failure",status.NO_PERMISSION.status,req.ip,description)
    res.json(ResData.setResultErr("changePassword",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
  }
})
*/

router.post("/delete-admin",async (req, res) => {
  let reqData = req.body;
  let adminId = reqData.adminId;
  let deleteAdminId = reqData.deleteAdminId;
  let adminPw = reqData.adminPw
  let checkpassword = await adminsDB.checkPassword(adminId,adminPw)
  let description  = "Administrator "+adminId+" has requested to delete admin "+deleteAdminId
  if(await adminsDB.isSuperAdmin(adminId) && deleteAdminId !== adminId){
    if(await adminsDB.isLock(adminId)){
      if(checkpassword){
        let result = await adminsDB.deleteAdmin(deleteAdminId);
        if(result){
          logger.adminInfoLog(adminId,"deleteAdmin","success",status.RESULT_OK.status,req.ip,description,deleteAdminId)
          res.json(ResData.setResultOK(null, "dAdmin",jwt.createAdminJWT(adminId),true));
        }else{
          logger.adminErrLog(adminId,"deleteAdmin","failure",status.NOT_REGISTERED_ADMIN.status,req.ip,description,deleteAdminId)
          res.json(ResData.setResultErr("deleteAdmin",status.NOT_REGISTERED_ADMIN.status,status.NOT_REGISTERED_ADMIN.msg));
        } 
      }else{
        logger.adminErrLog(adminId,"deleteAdmin","failure",status.INVALID_PASSWORD.status,req.ip,description,deleteAdminId)
        res.json(ResData.setResultErr("deleteAdmin",status.INVALID_PASSWORD.status,status.INVALID_PASSWORD.msg));
      } 
    }else{
      logger.adminErrLog(adminId,"deleteAdmin","failure",status.NO_PERMISSION.status,req.ip,description,deleteAdminId)
      res.json(ResData.setResultErr("deleteAdmin",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
    }
}else{
  logger.adminErrLog(adminId,"deleteAdmin","failure",status.NO_PERMISSION.status,req.ip,description,deleteAdminId)
  res.json(ResData.setResultErr("deleteAdmin",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
}
})


router.post("/get-admin-info", async (req, res) => {
  let reqData = req.body;
  let adminId = reqData.adminId
  let searchAdminId = reqData.searchAdminId
  let adminInfo;
  if(await adminsDB.getAdminID(adminId)){
    if(searchAdminId){
      adminInfo = await adminsDB.findAdmin(searchAdminId)      
    }else{
      adminInfo = await adminsDB.findAllAdmin()  
    }  
    if(adminInfo){     
     res.json(ResData.setResultOK(adminInfo, "getAdminInfo",jwt.createAdminJWT(adminId),true));
    }else{
     res.json(ResData.setResultErr("getAdminInfo",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
    }
  }else{
    res.json(ResData.setResultErr("getAdminInfo",status.NOT_REGISTERED_ADMIN.status,status.NOT_REGISTERED_ADMIN.msg));
  }
})



router.post("/get-user-history", async (req, res) => {
  let reqData = req.body;
  let adminId = reqData.adminId
  let reqMap= new Map()
  let date = {};
  let toDate = new Date(reqData.dateTo)
  date.$gt = new Date(reqData.dateFrom)
  date.$lt = toDate.setDate(toDate.getDate()+1)
  reqMap.set("userId",reqData.userId);
  reqMap.set("date",date);
  reqMap.set("requestType",reqData.requestType);
  reqMap.set("actionType",reqData.actionType);
  reqMap.set("operationResult",reqData.operationResult);
  reqMap.set("statusCode",reqData.statusCode);

  try{
    let result = await adminsDB.userHistory(reqMap); 
    res.json(ResData.setResultOK(result,"getUserHistory",jwt.createAdminJWT(reqData.adminId),true))
  }catch(err){
    res.json(ResData.setResultErr("getUserHistory",status.BAD_REQUEST.status,status.BAD_REQUEST.msg));
  }
})

router.post("/get-admin-history", async (req, res) => {
  let reqData = req.body;
  let adminId = reqData.adminId
  let searchAdminId = reqData.searchAdminId
  let reqMap= new Map()
  let date = {};
  let toDate = new Date(reqData.dateTo)
  date.$gt = new Date(reqData.dateFrom)
  date.$lt = toDate.setDate(toDate.getDate()+1)
  reqMap.set("adminId",searchAdminId);
  reqMap.set("date",date);
  reqMap.set("requestType",reqData.requestType);
  reqMap.set("operationResult",reqData.operationResult)
  reqMap.set("statusCode",reqData.statusCode)
  reqMap.set("destId",reqData.destId);

  try{
    let result = await adminsDB.adminHistory(reqMap);
    res.json(ResData.setResultOK(result,"getAdminHistory",jwt.createAdminJWT(adminId),true))
  }catch(err){
    res.json(ResData.setResultErr("getAdminHistory",status.BAD_REQUEST.status,status.BAD_REQUEST.msg));
  }
})
/*
router.get("/createAdmin", async (req, res) => {
  let reqData = req.query;
  let result =await adminsDB.createAdmins('doye',"keypair","박성종",null)
  //let result = jwt.createAdminJWT("doye");
  console.log(result)
  res.send(result);
})
router.get("/test", async (req, res) => {
  let result = new Date('2019-04-05')
  
  console.log(result.setDate(result.getDate()+1))
  logger.adminInfoLog("doye","deleteUserRegister","success",status.RESULT_OK.status,req.ip,"test")
  res.send(result);
})
*/
module.exports = router;
