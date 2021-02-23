const admins = require("../DBSchema/adminsSchema");
const userLog = require("../DBSchema/uselogSchema");
const users = require("../DBSchema/usersSchema");
const adminLog = require("../DBSchema/adminlogSchema");
const encryption = require("../utill");
require("date-utils");

isSuperAdmin = async adminId => {
  let result = await admins
    .findOne({ adminId: adminId })
    .then(result => {
      if (result.role === "superAdmin") {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => {
      return false;
    });

  return result;
};

isSuperAdmiDB = async () => {
  let result = await admins
    .find({ role: "superAdmin" })
    .then(result => {
      if (result.length >= 1) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => {
      return false;
    });
  return result;
};

isLock = async adminId => {
  let result = await admins
    .findOne({ adminId: adminId })
    .then(async result => {
      if(result.lock){
        return false
      }else{
        return true
      }
    });
    return result
};
adminLogin = async (adminId, password) => {
  let result = await admins.findOne({ adminId: adminId }).then(async result => {
    if (result) {
      if (!result.lock) {
        if (result.password === encryption(password)) {
          result.lastLogin = new Date();
          result.count = 0;
          let updateAdmin = await result
            .save()
            .then(result => {
              return 0;
            })
            .catch(err => {
              return false;
            });
          return updateAdmin;
        } else {
          result.count = result.count + 1;
          if (result.count >= 5) result.lock = true;
          let updateAdmin = await result
            .save()
            .then(result => {
              return 1;
            })
            .catch(err => {
              return false;
            });
          return updateAdmin;
        }
      } else {
        return 3;
      }
    } else {
      return 2;
    }
  });
  return result;
};

addAdmin = async (addAdminId, password, name, email) => {
  if (addAdminId) {
    let result = await getAdminID(addAdminId);
    if (!result) {
      if (password) {
        let result = await createAdmins(addAdminId, password, name, email);
        return result;
      } else {
        return false;
      }
    } else {
      return "exist";
    }
  } else {
    return false;
  }
};

updateAdminInfo = async (editAdmin, name, email, editPassword, lock) => {
  let returnResult = await admins
    .findOne({ adminId: editAdmin })
    .then(async result => {
      if (result) {
        if (name) result.name = name;
        if (email) result.email = email;
        if (editPassword) {
          result.password = encryption(editPassword);
        }
        console.log("lock test", lock);
        if (lock !== null && lock !== "") {
          result.lock = lock;
          result.count = 0;
        }
        let updateAdmin = await result
          .save()
          .then(result => {
            return true;
          })
          .catch(err => {
            console.log(err);
            return false;
          });
        return updateAdmin;
      } else {
        return false;
      }
    });
  return returnResult;
};

checkPassword = async (editAdmin, adminPassword) => {
  try {
    let encryptionPass = encryption(adminPassword);
    let returnResult = await admins
      .findOne({ adminId: editAdmin, password: encryptionPass })
      .then(async result => {
        if (result) {
          result.count = 0;
          let updateAdmin = await result
            .save()
            .then(result => {
              return true;
            })
            .catch(err => {
              return err;
            });
          return updateAdmin;
        } else {
          let updateAdminCount = await admins
            .findOne({ adminId: editAdmin })
            .then(async result => {
              result.count = result.count + 1;
              if (result.count >= 5) result.lock = true;
              let updateAdmin = await result
                .save()
                .then(result => {
                  return false;
                })
                .catch(err => {
                  return err;
                });
              return updateAdmin;
            });
          return updateAdminCount;
        }
      });
    return returnResult;
  } catch (err) {
    return false;
  }
};

deleteAdmin = async dAdmin => {
  try {
    let result = await admins.deleteOne({ adminId: dAdmin }).then(result => {
      return result.n;
    });
    return result;
  } catch (err) {
    return 0;
  }
};

getAdminID = adminId => {
  let result = admins
    .findOne({ adminId: adminId })
    .then(result => {
      console.log("findUser : ", result);
      if (result) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => {
      return false;
    });
  return result;
};

createAdmins = async (adminId, password, name, email) => {
  let admin = new admins({
    adminId: adminId,
    password: encryption(password),
    name: name,
    email: email,
    role: "admin",
    generationDate: new Date(),
    count: 0,
    lock: false
  });
  let result = await admin
    .save()
    .then(result => {
      return true;
    })
    .catch(err => {
      return false;
    });
  return result;
};

createSuperAdmin = async () => {
  let admin = new admins({
    adminId: "admin",
    password: encryption("admin123"),
    name: null,
    email: null,
    role: "superAdmin",
    generationDate: new Date(),
    count: 0,
    lock: false
  });
  let result = await admin
    .save()
    .then(result => {
      return true;
    })
    .catch(err => {
      return false;
    });
  return result;
};

findAllAdmin = async () => {
  let result = await admins
    .find({})
    .select({
      adminId: 1,
      name: 1,
      email: 1,
      role: 1,
      generationDate: 1,
      lock: 1,
      _id: 0
    })
    .then(result => {
      return result;
    });
  return result;
};

findAllUsers = async () => {
  let result = await users
    .find({})
    .select({
      userId: 1,
      lastRegistered: 1,
      lastAuthentication: 1,
      status: 1,
      _id: 0
    })
    .then(result => {
      return result;
    });
  return result;
};

findAdmin = sAdmin => {
  let result = admins
    .find({ adminId: sAdmin })
    .select({
      adminId: 1,
      name: 1,
      email: 1,
      role: 1,
      generationDate: 1,
      lock: 1,
      _id: 0
    })
    .then(result => {
      console.log("findAdmin : ", result);
      if (result) return result;
      else return false;
    })
    .catch(err => {
      return false;
    });
  return result;
};

findUser = userId => {
  let result = users
    .find({ userId: userId })
    .select({
      userId: 1,
      lastRegistered: 1,
      lastAuthentication: 1,
      status: 1,
      _id: 0
    })
    .then(result => {
      console.log("findUser : ", result);
      if (result) return result;
      else return false;
    })
    .catch(err => {
      return false;
    });
  return result;
};

addAdminLog = (
  adminId,
  requestType,
  operationResult,
  statusCode,
  ipAddr,
  description,
  destId
) => {
  let adminlog = new adminLog({
    adminId: adminId,
    date: new Date(),
    requestType: requestType,
    operationResult: operationResult,
    statusCode: statusCode,
    ipAddr: ipAddr,
    description: description,
    destId: destId
  });
  adminlog.save((err, adminlog) => {
    if (err) {
      console.error(err);
      return false;
    }
  });
  return true;
};

userHistory = (reqArray, to, from) => {
  let result;
  let query = {};
  for (var [key, value] of reqArray) {
    if (value) {
      query[key] = value;
    }
  }
  console.log(query);
  result = userLog
    .find(query)
    .sort("-date")
    .select({
      userId: 1,
      date: 1,
      requestType: 1,
      actionType: 1,
      operationResult: 1,
      statusCode: 1,
      ipAddr: 1,
      _id: 0
    })
    .then(result => {
      return result;
    });

  return result;
};

adminHistory = reqArray => {
  let result;
  let query = {};
  for (var [key, value] of reqArray) {
    if (value) {
      query[key] = value;
    }
  }
  console.log(query);
  result = adminLog
    .find(query)
    .sort("-date")
    .select({
      adminId: 1,
      date: 1,
      description: 1,
      requestType: 1,
      operationResult: 1,
      statusCode: 1,
      ipAddr: 1,
      destId: 1,
      _id: 0
    })
    .then(result => {
      return result;
    });

  return result;
};
module.exports = {
  getAdminID,
  addAdmin,
  createAdmins,
  findAllAdmin,
  findAdmin,
  findAllUsers,
  findUser,
  userHistory,
  adminLogin,
  addAdminLog,
  deleteAdmin,
  checkPassword,
  adminHistory,
  updateAdminInfo,
  isSuperAdmin,
  isSuperAdmiDB,
  createSuperAdmin,
  isLock
};
