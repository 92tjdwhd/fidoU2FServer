const express = require("express");
const router = express.Router();
const licenseDB = require("../src/DB/licenseDB")
const jwt = require("../src/jwt/jwt")
const ResData = require("../src/ResponseFormat");
const status = require("../src/value/statusCode");

router.post("/get-license-info", async (req, res) => {
    let reqData = req.body;
    let adminId = reqData.adminId
    
    if(await licenseDB.getLicenseKey()){
    let result = await licenseDB.getLicenseInfo()
        if(result){
            res.json(ResData.setResultOK(result,"licenseInfo",jwt.createAdminJWT(adminId),true));
        }else{
            res.json(ResData.setResultErr("licenseInfo",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg));
        }   
    }else{
        res.json(ResData.setResultErr("licenseInfo",status.No_LICENSE.status,status.No_LICENSE.msg));
    }
});

router.post("/change-license", async (req, res) => {
    let reqData = req.body;
    let adminId = reqData.adminId
    let newLicense = reqData.license
    let result = await licenseDB.updateLicense(newLicense);
    if(result){
        res.json(ResData.setResultOK(result,"changeLicense",jwt.createAdminJWT(adminId),true));
    }else{
        res.json(ResData.setResultErr("changeLicense",status.UNAVAILABLE_LICENSE.status,status.UNAVAILABLE_LICENSE.msg));
    }
   
});

router.post("/check-license", async (req, res) => {
    if(await licenseDB.getLicenseKey()){
        // 라이센크 검증 프로세서 
        licensKey = await licenseDB.getLicenseKey()
        let verifyLicense = jwt.verifyLicense(licensKey,req.connection.localAddress) 
        
        if(verifyLicense.result){ // 
            res.json(ResData.setResultOK(true,"licenseVerify","",true));
        }else{
            switch(verifyLicense.errName){
            case "JsonWebTokenError":  
            res.json(ResData.setResultErr("licenseVerify",status.ERROR_LICENSE.status,verifyLicense.errMessage));
            break;
            case "TokenExpiredError":
            res.json(ResData.setResultErr("licenseVerify",status.EXPIRED_LICENSE.status,status.EXPIRED_LICENSE.msg));
            break;
            case "NotBeforeError":
            res.json(ResData.setResultErr("licenseVerify",status.NOT_BEFORE_LICENSE_ERROR.status,status.NOT_BEFORE_LICENSE_ERROR.msg));
            break;
            }
        }
    }else{
        res.json(ResData.setResultErr("licenseInfo",status.No_LICENSE.status,status.No_LICENSE.msg));
    }   
});

module.exports = router;
