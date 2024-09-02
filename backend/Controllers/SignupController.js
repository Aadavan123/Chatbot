const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Usermodel');
const twilio = require('twilio');

// Initialize Twilio Client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
exports.sendOtp = async (req, res) => {
  const { mobileNumber } = req.body;
  
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: mobileNumber, channel: 'sms' });
    
    console.log(`OTP sent to ${mobileNumber}:`, verification.sid);  // Logging for debugging
    res.status(200).send('OTP sent');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
};

// Create User (with OTP verification)
exports.CreateUser = async (req, res) => {
  const { name, email, mobileNumber, password, otp } = req.body;

  try {
    // Verify the OTP first
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: mobileNumber, code: otp });
    
    if (!verificationCheck.valid) {
      return res.status(400).send('Invalid OTP');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return res.status(400).send('User details already exist');
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, mobileNumber, password: hashedPassword });
    await newUser.save();

    res.status(201).send('Signup successful');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobileNumber, password } = req.body;
  
  try {
    const updatedData = { name, email, mobileNumber };
    
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!user) return res.status(404).send('User not found');
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) return res.status(404).send('User not found');
    
    res.send('User deleted');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
};
