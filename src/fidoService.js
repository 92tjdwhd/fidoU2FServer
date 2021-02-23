var u2fServer = require("./u2f");
var registration;
const APP_ID = "https://keypair.co.kr/u2f";
const fidoDB = require("../src/DB/fidoUserDB");

startReg = () => {
  try {
    let challenge = u2fServer.startRegistration(APP_ID);
    console.log("getChallenge :", challenge);
    return challenge;
  } catch (err) {
    return false;
  }
};

finishReg = (challenge, deviceResponse) => {
  try {
    registration = u2fServer.finishRegistration(challenge, deviceResponse);
    console.log("getRegistration :", registration);
    return registration;
  } catch (err) {
    return false;
  }
};

startAuth = (userRegisterData) => {
  try {
    let challenge = u2fServer.startAuthentication(APP_ID, userRegisterData);
  
    return challenge;
  } catch (err) {
  
    return false;
  }
};

finishAuth = (
  challenge,
  deviceResponse,
  deviceRegistration
) => {
  try {
    let result = u2fServer.finishAuthentication(
      challenge,
      deviceResponse,
      deviceRegistration
    );
    console.log("finish Auth result: ", result);
    return result;
  } catch (err) {
    return false;
  }
};
deleteReg = async userId => {
  try {
    let result = await fidoDB.deleteRegistration(userId);
    console.log("deleteReg: ", result);
    return result;
  } catch (err) {
    return err;
  }
};
module.exports = { startReg, finishReg, startAuth, finishAuth, deleteReg };
