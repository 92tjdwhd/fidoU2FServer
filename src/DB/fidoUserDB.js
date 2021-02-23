const users = require("../DBSchema/usersSchema");
const userLog = require("../DBSchema/uselogSchema");
const safelib = require("url-safe-base64");

require("date-utils");

isRegistration = userId => {
  let result = users
    .findOne({ userId: userId })
    .then(result => {
      console.log("findUser : ", result);
      if (result) return true;
      else return false;
    })
    .catch(err => {
      return false;
    });
  return result;
};

addRegistration = async (userId, publicKey, keyHandle, certificate) => {
  let result = await users
    .findById(await getUserID(userId))
    .then(async result => {
      console.log(result);
      result.userDeviceToken = " ";
      result.publicKey = publicKey;
      result.keyHandle = keyHandle;
      result.certificate = certificate;
      result.lastRegistered = new Date();
      let saveResult = await result
        .save()
        .then(result => {
          console.log(result);
          return true;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
      return saveResult;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
  return result;
};

deleteRegistration = async userId => {
  try {
    let result = await users.deleteOne({ userId: userId }).then(result => {
      return result.n;
    });
    return result;
  } catch (err) {
    return 0;
  }
};

getUserRegisterData = userId => {
  let result = users
    .findOne({ userId: userId })
    .then(result => {
      console.log("findUser : ", result);
      return {
        publicKey: result.publicKey,
        keyHandle: safelib.decode(result.keyHandle),
        certificate: result.certificate
      };
    })
    .catch(err => {
      return false;
    });
  return result;
};

getUserID = userId => {
  let result = users
    .findOne({ userId: userId })
    .then(result => {
      console.log("findUser : ", result);
      return result._id;
    })
    .catch(err => {
      return false;
    });
  return result;
};

createUser = userId => {
  let user = new users({
    userId: userId,
    userDeviceToken: " ",
    publicKey: " ",
    keyHandle: " ",
    certificate: " ",
    lastRegistered: null,
    lastAuthentication: null,
    authenCount: 0,
    status: "enabled"
  });
  user.save((err, user) => {
    if (err) {
      console.error(err);
      return false;
    }
    console.dir(user);
  });
  return true;
};

getUserAuthenCount = userId => {
  let result = users
    .findOne({ userId: userId })
    .then(result => {
      console.log("findUser : ", result);
      return result.authenCount;
    })
    .catch(err => {
      return false;
    });
  return result;
};

updateUserAuthenCount = async (userId, authenCount) => {
  let result = await users
    .findById(await getUserID(userId))
    .then(async result => {
      console.log(result);
      result.authenCount = authenCount;
      result.lastAuthentication = new Date();
      let saveResult = await result
        .save()
        .then(result => {
          console.log(result);
          return true;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
      return saveResult;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
  return result;
};

addUserLog = (
  userId,
  requestType,
  actionType,
  operationResult,
  statusCode,
  ipAddr
) => {
  let userlog = new userLog({
    userId: userId,
    date: new Date(),
    requestType: requestType,
    actionType: actionType,
    operationResult: operationResult,
    statusCode: statusCode,
    ipAddr: ipAddr
  });
  userlog.save((err, userLog) => {
    if (err) {
      console.error(err);
      return false;
    }
  });
  return true;
};

getUserLog = userId => {
  let result = userLog
    .findOne({ userId: userId })
    .then(result => {
      return result.authenCount;
    })
    .catch(err => {
      return false;
    });
  return result;
};

setDisableUserStatus = async userId => {
  let result = users.findOne({ userId: userId }).then(async result => {
    if(result){
      result.status = "disabled";      
      let saveResult = await result
        .save()
        .then(result => {
          console.log(result);
          return true;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
      return saveResult;
    }  
  });
  return result;
};

isUserStatus = async userId => {
  let result = await users.findOne({ userId: userId }).then(result => {
    if (result) {
      if (result.status === "disabled") {
        return false;
      } else {
        return true;
      }
    }else{
      return true;
    }
  });
  return result;
};

module.exports = {
  isRegistration,
  addRegistration,
  createUser,
  getUserRegisterData,
  addUserLog,
  getUserAuthenCount,
  updateUserAuthenCount,
  deleteRegistration,
  setDisableUserStatus,
  isUserStatus
};
