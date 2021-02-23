const adminDB = require("../src/DB/adminDB")
const licenseDB = require("../src/DB/licenseDB")
const logger = require("../src/logger")
const jwt = require("../src/jwt/jwt");
require("date-utils");

isSuperAdmin = async () => {
    let isSuperAdmin = await adminDB.isSuperAdmiDB()
    let isLicense = await licenseDB.isLicense(); 
    // let license = jwt.createLicense();
    // let verifyLicense = jwt.verifyLicense(license);
    
    if(!isSuperAdmin){
        adminDB.createSuperAdmin()
    }
    if(!isLicense){
      let result =  await licenseDB.createLicense()
        console.log(result)
    }
    
}

module.exports = isSuperAdmin