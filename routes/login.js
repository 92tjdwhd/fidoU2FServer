const express = require("express");
const router = express.Router();
const adminsDB = require("../src/DB/adminDB")
const ResData = require("../src/ResponseFormat");
const jwt = require("../src/jwt/jwt")
const logger = require("../src/logger")
const status= require("../src/value/statusCode")
router.post("/", async (req,res) => {
    let reqData = req.body;
    let adminId = reqData.adminId;
    let adminPw = reqData.adminPw;
    console.log("body",req.body)
    let description  = adminId+" is trying to login."
    let result = await adminsDB.adminLogin(adminId,adminPw);
    if(result === 0){
        logger.adminInfoLog(adminId,"loginAdmin","success",status.RESULT_OK.status,req.ip,description,adminId)
        res.json(ResData.setResultOK("success","loginAdmin",jwt.createAdminJWT(adminId),true))
    }else if(result === 1){
        logger.adminErrLog(adminId,"loginAdmin","failure",status.INVALID_PASSWORD.status,req.ip,description,adminId)
        res.json(ResData.setResultErr("loginAdmin",status.INVALID_PASSWORD.status,status.INVALID_PASSWORD.msg))
    }else if(result === 2){
        logger.adminErrLog(adminId,"loginAdmin","failure",status.NOT_REGISTERED_ADMIN.status,req.ip,description,adminId)
        res.json(ResData.setResultErr("loginAdmin",status.NOT_REGISTERED_ADMIN.status,status.NOT_REGISTERED_ADMIN.msg))
    }else if(result === 3){
        logger.adminErrLog(adminId,"loginAdmin","failure",status.ACCOUNT_LOCKOUT.status,req.ip,description,adminId)
        res.json(ResData.setResultErr("loginAdmin",status.ACCOUNT_LOCKOUT.status,status.ACCOUNT_LOCKOUT.msg))
    }else{
        logger.adminErrLog(adminId,"loginAdmin","failure",status.INTERNAL_SERVER_ERROR.status,req.ip,description,adminId)
        res.json(ResData.setResultErr("loginAdmin",status.INTERNAL_SERVER_ERROR.status,status.INTERNAL_SERVER_ERROR.msg))
    }    
})




module.exports = router;