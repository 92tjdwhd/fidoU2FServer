const jwt = require("jsonwebtoken");
const secret = require("./config");
const fs = require("fs");
const safelib = require("url-safe-base64");
const licensePubkey = Buffer.from(secret.license_pub_key);

createAdminJWT = adminId => {
  const payload = {
    userId: adminId
  };
  const signOptions = {
    issuer: "keypair",
    subject: "adminToken",
    audience: adminId,
    expiresIn: 10*60
  };
  try {
    let token = jwt.sign(payload, secret.jwtAdminSecret, signOptions);
    return token;
  } catch (err) {
    return err;
  }
};

verifyAdminJWT = (token, adminId) => {
  const verifyOption = {
    issuer: "keypair",
    subject: "adminToken",
    audience: adminId,
    expiresIn: 60 * 10
  };
  let result = jwt.verify(token, secret.jwtAdminSecret, verifyOption, err => {
    if (err) {
      console.log(err.name);
      return { result: false, errName: err.name, errMessage: err.message };
    } else {
      return { result: true };
    }
  });
  return result;
};

createUserJWT = userId => {
  const payload = {
    userId: userId
  };
  const signOptions = {
    issuer: "keypair",
    subject: "userToken",
    audience: userId,
    expiresIn: 60
  };
  try {
    let token = jwt.sign(payload, secret.jwtUserSecret, signOptions);
    return token;
  } catch (err) {
    return err;
  }
};

verifyUserJWT = (token, userId) => {
  const verifyOption = {
    issuer: "keypair",
    subject: "userToken",
    audience: userId,
    expiresIn: 60
  };
  let result = jwt.verify(token, secret.jwtUserSecret, verifyOption, err => {
    if (err) {
      console.log(err.name);
      return { result: false, errName: err.name, errMessage: err.message };
    } else {
      return { result: true };
    }
  });
  return result;
};

verifyLicense = (licensekey, ip) => {
  const license = Buffer.from(safelib.decode(licensekey), "base64").toString();
  let result = jwt.verify(
    license,
    licensePubkey,
    secret.verifyOption,
    (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          let decodeLicense = jwt.decode(license, { complete: true });
          return {
            result: false,
            errName: err.name,
            errMessage: err.message,
            header: decodeLicense.header,
            payload: decodeLicense.payload
          };
        } else {
          return { result: false, errName: err.name, errMessage: err.message };
        }
      } else {
        if (decode.ipAddress === ip) {
          if (decode.user === secret.verifyOption.user) {
            let decodeLicense = jwt.decode(license, { complete: true });
            return {result: true, header: decodeLicense.header, payload: decodeLicense.payload};
          }else{
            return {
              result: false, errName: "JsonWebTokenError", errMessage: "user Mismatch"};
          }
        } else {
          return {
            result: false, errName: "JsonWebTokenError", errMessage: "IP Address Mismatch"};
        }
      }
    }
  );
  return result;
};

module.exports = {
  createAdminJWT,
  verifyAdminJWT,
  createUserJWT,
  verifyUserJWT,
  verifyLicense
};
