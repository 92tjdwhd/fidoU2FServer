const mongoose = require("mongoose");

const { Schema } = mongoose;
const users = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  userDeviceToken: {
    type: String,
    required: true
  },
  publicKey: {
    type: String,
    required: true
  },
  keyHandle: {
    type: String,
    required: true
  },
  certificate: {
    type: String,
    required: true
  },
  lastRegistered:{
    type: Date,
    required: false
  },
  lastAuthentication:{
    type: Date,
    required: false
  },
  authenCount:{
    type: Number,
    required: true
  },
  status:{
    type:String,
    required: true
  }
});

module.exports = mongoose.model("users", users);
