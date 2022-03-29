const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    max: 50,
  },
  name: {
    type: String,
    required: true,
    max: 100,
  },
  password: {
    type: String,
    default: "",
    required: false,
  },
  hasAcount: {
    type: Boolean,
    default: false,
    required: true,
  },
  phone: {
    type: String,
    default: "",
    required: false,
  },
  tempid: {
    type: String,
    default: "",
    required: false,
  },
});

module.exports = mongoose.model("Users", userSchema);