const express = require("express");
const router = express.Router();
const logger = require("../src/logger");
const ResData = require("../src/ResponseFormat");
const jwt = require("../src/jwt/jwt")
const status = require("../src/value/statusCode")
const fidoDB = require("../src/DB/fidoUserDB")

router.post("/", async (req, res) => {
    let reqData = req.body
    let userId = reqData.userId
    let userToken = reqData.token.jwt;

    if(userId && userToken){
        if(fidoDB.isUserStatus(userId)){       
            let verify = await jwt.verifyUserJWT(userToken,userId)
            if(verify.result){
                let result = {userId:userId}
                logger.userInfoLog(userId,"verifyUserToken","request","success",status.RESULT_OK.status,req.ip)
                res.json(ResData.setResultOK(result,"verifyUserToken","",false));
            }else{
                switch(verify.errName){
                    case "JsonWebTokenError":  
                    logger.userErrLog(userId,"verifyUserToken","request","failure",status.ERROR_TOKEN.status,req.ip)
                    res.json(ResData.setResultErr("verifyUserToken",status.ERROR_TOKEN.status,verify.errMessage));
                    break;
  
                    case "TokenExpiredError":
                    logger.userErrLog(userId,"verifyUserToken","request","failure",status.EXPIRED_TOKEN.status,req.ip)
                    res.json(ResData.setResultErr("verifyUserToken",status.EXPIRED_TOKEN.status,status.EXPIRED_TOKEN.msg));
                    break;
  
                    case "NotBeforeError":
                    logger.userErrLog(userId,"verifyUserToken","request","failure",status.NOT_BEFORE_ERROR.status,req.ip)
                    res.json(ResData.setResultErr("verifyUserToken",status.NOT_BEFORE_ERROR.status,status.NOT_BEFORE_ERROR.msg));
                    break;
                }
            }
        }else{
            logger.userErrLog(userId,"verifyUserToken","request","failure",status.UNKNOWN_USERID.status,req.ip)
            res.json(ResData.setResultErr("verifyUserToken",status.UNKNOWN_USERID.status,status.UNKNOWN_USERID.msg));
        }
    }else{
        logger.userErrLog("UnKnowUser","verifyUserToken","request","failure",status.BAD_REQUEST.status,req.ip)
        res.json(ResData.setResultErr("verifyUserToken",status.BAD_REQUEST.status,status.BAD_REQUEST.msg));
    }
})

module.exports = router