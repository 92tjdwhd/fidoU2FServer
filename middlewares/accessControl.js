const ResData = require("../src/ResponseFormat");
const jwt = require("../src/jwt/jwt");
const adminDB = require("../src/DB/adminDB")
const logger = require("../src/logger")
const status = require("../src/value/statusCode")

accessAdmin = () => async (req, res, next) => {
  let reqData = req.body 
  let description  = "Token verification failed."

  if(req.originalUrl.search("/startDeregister") !== -1 && req.method ==='POST'){
      try{
      let userId = reqData.userId;
      let userToken = reqData.token.jwt;
      console.log('userID: ', userId)
      console.log('userToken: ', userToken)
      let verify = await jwt.verifyUserJWT(userToken,userId)
      if(verify.result){
        next()
      }else{
        switch(verify.errName){
          case "JsonWebTokenError":  
          logger.userErrLog(userId,"verifyToken","request","failure",status.ERROR_TOKEN.status,req.ip)
          res.json(ResData.setResultErr("verifyToken",status.ERROR_TOKEN.status,verify.errMessage));
          break;
          case "TokenExpiredError":
          logger.userErrLog(userId,"verifyToken","request","failure",status.EXPIRED_TOKEN.status,req.ip)
          res.json(ResData.setResultErr("verifyToken",status.EXPIRED_TOKEN.status,status.EXPIRED_TOKEN.msg));
          break;

          case "NotBeforeError":
          logger.userErrLog(userId,"verfity token","request","failure",status.NOT_BEFORE_ERROR.status,req.ip)
          res.json(ResData.setResultErr("verifyToken",status.NOT_BEFORE_ERROR.status,status.NOT_BEFORE_ERROR.msg));
          break;
        }   
      }
    }catch(err){
      res.send(err.message)
    }
  }
  else if (req.originalUrl.search("/admin/") !== -1 && req.method ==='POST') {
    let adminId =reqData.adminId;
    let adminToken = reqData.token.jwt;
    try {
      let verify = await jwt.verifyAdminJWT(adminToken,adminId);
      console.log("verifyAdminJWT result: ", verify);
      if (verify.result){
        if(req.originalUrl.search("deleteUserRegister") === 0 || req.originalUrl.search("deleteAdmin")=== 0 || req.originalUrl.search("changePassword")=== 0 || req.originalUrl.search("addAdmin")=== 0){
          if(await adminDB.isSuperAdmin(adminId)){
            next();
          }else{
            logger.adminErrLog(adminId,"authorization","failure",status.NO_PERMISSION.status,req.ip,description)
            res.json(ResData.setResultErr("authorization",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
          }
        }else{
          next()
        }       
      } else {        
        switch(verify.errName){
          case "JsonWebTokenError":  
          logger.adminErrLog(adminId,"verifyToken","failure",status.ERROR_TOKEN.status,req.ip,description)
          res.json(ResData.setResultErr("verifyToken",status.ERROR_TOKEN.status,verify.errMessage));
          break;

          case "TokenExpiredError":
          logger.adminErrLog(adminId,"verifyToken","failure",status.EXPIRED_TOKEN.status,req.ip,description)
          res.json(ResData.setResultErr("verifyToken",status.EXPIRED_TOKEN.status,status.EXPIRED_TOKEN.msg));
          break;

          case "NotBeforeError":
          logger.adminErrLog(adminId,"verifyToken","failure",status.NOT_BEFORE_ERROR.status,req.ip,description)
          res.json(ResData.setResultErr("verifyToken",status.NOT_BEFORE_ERROR.status,status.NOT_BEFORE_ERROR.msg));
          break;
        }   
      }
    } catch (err) {
      console.log(err)
      logger.adminErrLog(adminId,"request adminservice","failure",status.INTERNAL_SERVER_ERROR.status,req.ip,description)
      res.json(ResData.setResultErr("verifyToken",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
    }
  } else if(req.originalUrl.search("/license/") !== -1 && req.method ==='POST' && req.originalUrl.search("/checkLicense") !== -1) {
    let adminId =reqData.adminId;
    let adminToken = reqData.token.jwt;
    try {
      console.log("isadmin",await adminDB.isSuperAdmin(adminId))
      if( await adminDB.isSuperAdmin(adminId)){
        let verify = await jwt.verifyAdminJWT(adminToken,adminId);
        console.log("verifyAdminJWT result: ", verify);
        if (verify.result){
          if(req.originalUrl.search("deleteUserRegister") === 0 || req.originalUrl.search("deleteAdmin")=== 0 || req.originalUrl.search("changePassword")=== 0 || req.originalUrl.search("addAdmin")=== 0){
            if(await adminDB.isSuperAdmin(adminId)){
              next();
            }else{
              logger.adminErrLog(adminId,"authorization","failure",status.NO_PERMISSION.status,req.ip,description)
              res.json(ResData.setResultErr("authorization",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
            }
          }else{
            next()
          }       
        } else {        
          switch(verify.errName){
            case "JsonWebTokenError":  
            logger.adminErrLog(adminId,"verifyToken","failure",status.ERROR_TOKEN.status,req.ip,description)
            res.json(ResData.setResultErr("verifyToken",status.ERROR_TOKEN.status,verify.errMessage));
            break;

            case "TokenExpiredError":
            logger.adminErrLog(adminId,"verifyToken","failure",status.EXPIRED_TOKEN.status,req.ip,description)
            res.json(ResData.setResultErr("verifyToken",status.EXPIRED_TOKEN.status,status.EXPIRED_TOKEN.msg));
            break;

            case "NotBeforeError":
            logger.adminErrLog(adminId,"verifyToken","failure",status.NOT_BEFORE_ERROR.status,req.ip,description)
            res.json(ResData.setResultErr("verifyToken",status.NOT_BEFORE_ERROR.status,status.NOT_BEFORE_ERROR.msg));
            break;
          }   
        }
      }else{
        logger.adminErrLog(adminId,"authorization","failure",status.NO_PERMISSION.status,req.ip,description)
            res.json(ResData.setResultErr("authorization",status.NO_PERMISSION.status,status.NO_PERMISSION.msg));
      }
    } catch (err) {
      console.log(err)
      logger.adminErrLog(adminId,"authorization","failure",status.INTERNAL_SERVER_ERROR.status,req.ip,description)
      res.json(ResData.setResultErr("verifyToken",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
    }
  } else {
    next();
  }
};

module.exports = accessAdmin;
