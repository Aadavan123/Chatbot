const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, // Optional OTP field to store the OTP temporarily
  jwtSecret: { type: String }, // To store dynamic JWT secret
});

module.exports = mongoose.model('User', userSchema);
