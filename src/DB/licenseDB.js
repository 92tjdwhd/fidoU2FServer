const licenseInfo = require("../DBSchema/licenseInfoSchema");
const encryption = require("../utill");
const jwt = require("jsonwebtoken");
require("date-utils");

isLicense = async () => {
  let result = await licenseInfo
    .find()
    .then(result => {
      if (result.length > 0) {
        return true;
      } else return false;
    });
    return result;
};

createLicense = async () => {
  let newLicesne = new licenseInfo({
    licenseKey: "",
    issuedDate: null,
    startDate:null,
    expirationDate: null,
    issuer: "",
    subject:"",
    audience:"",
    ipAddress:"",
    user:""
  });

  let result = await newLicesne
    .save()
    .then(result => {
      return true;
    })
    .catch(err => {
        console.log(err)
      return false;
    });
    return result
};

getLicenseKey = async () =>{
    let result = await licenseInfo.findOne().then(result =>{
        //console.log("검색결과",result)
        let key = result.licenseKey      
        return key
    }).catch(err =>{
        return false
    })
    return result
}

updateLicense = async licensekey =>{
  try{
    let result = await licenseInfo.findOne().then(async result => {
      if(result){
        let license =  Buffer.from(licensekey, 'base64').toString()
        let decodeLicense = jwt.decode(license, {complete: true})
        result.licenseKey = licensekey;
        result.issuedDate = decodeLicense.payload.iat *1000.0
        result.startDate = decodeLicense.payload.nbf *1000.0
        result.expirationDate = decodeLicense.payload.exp *1000.0
        result.issuer = decodeLicense.payload.iss
        result.subject = decodeLicense.payload.sub
        result.audience = decodeLicense.payload.aud
        result.ipAddress = decodeLicense.payload.ipAddress
        result.user = decodeLicense.payload.user
        let updateAdmin = await result.save().then(result=>{
          return true
        }).catch(err =>{
          console.log(err)
          return false
        })
        return updateAdmin
      }   
    })
    return result
  }catch(err){
    return false;
  }
}
getLicenseInfo = async () =>{
  try{
      let result = await licenseInfo.findOne().select({_id:0}).then(result =>{           
          return result
      })
      return result
    }catch(err){
      return false
    }
}
 
module.exports = { createLicense, isLicense, getLicenseKey,getLicenseInfo,updateLicense };
