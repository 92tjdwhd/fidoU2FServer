const mongoose = require("mongoose");

const { Schema } = mongoose;
const adminLog = new Schema({
  adminId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  requestType: {
    type: String,
    required: true
  },
  operationResult:{
    type: String,
    require: true
  },
  statusCode: {
    type: String,
    required: true
  },
  ipAddr:{
    type:String,
    required: true
  },
  description:{
    type:String,
    required: true
  },
  destId:{
    type:String,
    require: false
  }
});

module.exports = mongoose.model("adminLog", adminLog);
