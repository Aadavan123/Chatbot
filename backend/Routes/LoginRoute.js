const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { login, sendOtp } = require('../Controllers/LoginController');
const validateToken = require('../middleware/validateToken');
const User = require('../Models/Usermodel');

// Route for sending OTP
router.post('/sendOtp', sendOtp);

// Route for user login
router.post('/login', login);

// Example protected route
router.get('/protected', validateToken, (req, res) => {
  res.send(`This is a protected route. Hello, ${req.user.name}!`);
});

// Route to validate the token
router.get('/validateToken', validateToken, (req, res) => {
  res.status(200).send('Token is valid');
});

// Route to get the user's name using the token
router.post('/getUserName', validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Using req.user from validated token
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ name: user.name });
  } catch (error) {
    console.error('Failed to get user name', error);
    res.status(500).send('Failed to get user name');
  }
});

module.exports = router;
