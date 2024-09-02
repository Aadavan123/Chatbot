const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const User = require('../Models/Usermodel');

// Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Send a POST request to the Flask API to send OTP
    const response = await axios.post('http://127.0.0.1:5000/sendOtp', { email });

    if (response.data.error) {
      console.error('Error sending OTP:', response.data.error);
      return res.status(500).send('Error sending OTP');
    }

    // Hash the OTP before saving
    user.otp = await bcrypt.hash(response.data.otp, 10);
    await user.save();

    res.status(200).send('OTP sent to your email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Signup to Login; you are a new user');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Email or Password does not match');
    }

    // Verify OTP
    if (otp) {
      const isOtpMatch = await bcrypt.compare(otp, user.otp);
      if (!isOtpMatch) {
        return res.status(400).send('Invalid OTP');
      }
      // Clear OTP after successful login
      user.otp = null;
      await user.save();
    }

    // Generate a new JWT secret key dynamically
    const dynamicJwtSecret = crypto.randomBytes(64).toString('hex');
    user.jwtSecret = dynamicJwtSecret;
    await user.save();

    // Include the user's name in the JWT payload
    const token = jwt.sign({ id: user._id, name: user.name }, dynamicJwtSecret, { expiresIn: '1h' });

    // Send response with the token
    return res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
};
