const mongoose = require("mongoose");

const { Schema } = mongoose;
const admins = new Schema({
  adminId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name:{
    type : String,
    required: false
  },
  email:{
    type : String,
    required: false
  },
  role:{
    type: String,
    required: true
  },
  generationDate:{
    type:Date,
    require:true
  },
  lastLogin:{
    type:Date,
    require:false
  },
  count:{
    type: Number,
    require:false
  },
  lock:{
    type: Boolean,
    require:true
  }
});

module.exports = mongoose.model("admins", admins);
