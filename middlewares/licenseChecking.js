const licenseDB = require("../src/DB/licenseDB");
const ResData = require("../src/ResponseFormat");
const status = require("../src/value/statusCode");
const jwt = require("../src/jwt/jwt");
const cluster = require("cluster");
require("date-utils");

const licenseChecking = () => async (req, res, next) => {
  console.log("프로세스 번호 :",cluster.worker.process.pid)
  if( req.originalUrl.search("/license") === -1 && req.originalUrl.search("/login-admin") === -1&& req.originalUrl.search("/get-admin-info") === -1){
    let licensKey = await licenseDB.getLicenseKey()
    // 라이센크 검증 프로세서 
    if(licensKey){
      let verifyLicense = jwt.verifyLicense(licensKey,req.connection.localAddress) 
      console.log("ip주소",req.connection.localAddress)      
      if(verifyLicense.result){ // 
        next()
      }else{
          switch(verifyLicense.errName){
            case "JsonWebTokenError":  
            res.json(ResData.setResultErr("License Error",status.ERROR_LICENSE.status,verifyLicense.errMessage));
            break;
            case "TokenExpiredError":
            if(req.originalUrl.search("/fido/u2f") !== -1){
              let expiratonDate = new Date(verifyLicense.payload.exp*1000.0);
              let nowDate = new Date()
              new Date(expiratonDate.setDate(expiratonDate.getDate()+30))
              if(nowDate.isBefore(expiratonDate)){
                next()
              }else{
                res.json(ResData.setResultErr("License Error",status.EXPIRED_LICENSE.status,status.EXPIRED_LICENSE.msg));
              }
            }else{
            res.json(ResData.setResultErr("License Error",status.EXPIRED_LICENSE.status,status.EXPIRED_LICENSE.msg));
            }
            break;
            case "NotBeforeError":
            res.json(ResData.setResultErr("License Error",status.NOT_BEFORE_LICENSE_ERROR.status,status.NOT_BEFORE_LICENSE_ERROR.msg));
            break;
          }
        }
      }else{
        res.json(ResData.setResultErr("licenseInfo",status.No_LICENSE.status,status.No_LICENSE.msg));
      }   
    }else{
     next();
  }
};

module.exports = licenseChecking;