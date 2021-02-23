const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    mongoose.connect(
      "mongodb://@localhost:27017",
      {
        dbName: "fidoServerDB",
      },
      error => {
        if (error) {
          console.log("몽고디비 연결 에러", error);
        } else {
          console.log("몽고디비 연결 성공");
        }
      }
    );
  };
  connect();
  mongoose.connection.on('error',(error) =>{
      console.error('몽고디비 연결 에러',error);
  })
  mongoose.connection.on('disconnected',()=>{
      console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
      connect();
  })
  require('../DBSchema/uselogSchema')
  require('../DBSchema/usersSchema')
  require('../DBSchema/adminsSchema')
  require('../DBSchema/adminlogSchema')
  require('../DBSchema/licenseInfoSchema')
};
