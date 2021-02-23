const mongoose = require("mongoose");

const { Schema } = mongoose;
const userLog = new Schema({
  userId: {
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
  actionType: {
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
  }
});

module.exports = mongoose.model("userLog", userLog);
