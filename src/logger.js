const loggerCustom = require("../src/CoustomLogger");
const connectUserDB = require("../src/DB/fidoUserDB")
const connectAdminDB = require("../src/DB/adminDB")


  userInfoLog = (userId, requestType, actionType, operationResult,statusCode,ipAddr) =>  {
    const log = `==> userId : ${userId} ==> requestType : ${requestType} ==> actionType : ${actionType} ==> operationResult :${operationResult} ==> statusCode : ${statusCode} ==> ipAddr : ${ipAddr}`;
    loggerCustom.userLogger.info(log)
    connectUserDB.addUserLog(userId,requestType,actionType,operationResult,statusCode,ipAddr)
   // loggerCustom.error(res.status(err.status || 500))

  };
  userErrLog = (userId, requestType, actionType, operationResult,statusCode,ipAddr) =>  {
    const log = `==> userId : ${userId} ==> requestType : ${requestType} ==> actionType : ${actionType} ==> operationResult :${operationResult} ==> statusCode : ${statusCode} ==> ipAddr : ${ipAddr}`;
    loggerCustom.userLogger.error(log)
    connectUserDB.addUserLog(userId,requestType,actionType,operationResult,statusCode,ipAddr)
   // loggerCustom.error(res.status(err.status || 500))

  };

  adminInfoLog = (adminId, requestType,operationResult,statusCode,ipAddr,description,id) =>  {
    const log = `==> adminId : ${adminId} ==> requestType : ${requestType} ==> operationResult :${operationResult} ==> statusCode : ${statusCode} ==> ipAddr : ${ipAddr}  ==> description : ${description}  ==> id : ${id}`;
    loggerCustom.adminLogger.info(log)
    connectAdminDB.addAdminLog(adminId,requestType,operationResult,statusCode,ipAddr,description,id)
   // loggerCustom.error(res.status(err.status || 500))
  };
  adminErrLog = (adminId, requestType, operationResult,statusCode,ipAddr,description,id) =>  {
    const log = `==> adminId : ${adminId} ==> requestType : ${requestType}==> operationResult :${operationResult} ==> statusCode : ${statusCode} ==> ipAddr : ${ipAddr} ==> description : ${description}  ==> id : ${id}`;
    loggerCustom.ServerLogger.error(log)
    connectAdminDB.addAdminLog(adminId,requestType,operationResult,statusCode,ipAddr,description,id)
   // loggerCustom.error(res.status(err.status || 500))

  };
module.exports = {userInfoLog,userErrLog,adminErrLog,adminInfoLog}