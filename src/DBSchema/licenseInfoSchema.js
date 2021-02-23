const mongoose = require("mongoose");

const { Schema } = mongoose;
const licenseInfo = new Schema({
  licenseKey: {
    type: String,
    required: false,
  },
  issuedDate: {
    type: Date,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  },
  expirationDate: {
    type: Date,
    required: false
  },
  issuer: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: false
  },
  audience: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  user: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model("licenseInfo", licenseInfo);
