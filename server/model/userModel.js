const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 50,
  },
  name: {
    type: String,
    required: true,
    max: 100,
  },
  password: {
    type: String,
    required: true,
  },
  hasAcount: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: "",
  },
  tempid: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);