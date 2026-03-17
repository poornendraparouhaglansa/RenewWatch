const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,

  companyName: {
    type: String,
  },

  phone: {
    type: String,
  },

  jobTitle: {
    type: String,
  },

  location: {
    type: String,
  },

  avatarUrl: {
    type: String,
  },

  notificationEmail: {
    type: String,
  },

  resetOtp: String,
  resetOtpExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);