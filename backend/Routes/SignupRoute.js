const express = require('express');
const UserController = require('../Controllers/SignupController');
const router = express.Router();
const User = require('../Models/Usermodel');

router.post('/CreateUser', UserController.CreateUser); // Create
router.post('/sendOtp', UserController.sendOtp); // Send OTP

router.get('/users', UserController.getAllUsers); // Read all users
router.put('/users/:id', UserController.updateUser); // Update a user by ID
router.delete('/users/:id', UserController.deleteUser); // Delete a user by ID

// Route to check if user exists by email or mobile number
router.post('/checkUser', async (req, res) => {
  const { email, mobileNumber } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    if (user) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking user existence', error);
    res.status(500).send('Error checking user existence');
  }
});

module.exports = router;
