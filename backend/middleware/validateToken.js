const jwt = require('jsonwebtoken');
const User = require('../Models/Usermodel');

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token
    if (!token) {
      return res.status(403).send('Token is required for authentication');
    }

    // Decode the token without verifying it to get the user ID
    const decodedToken = jwt.decode(token);

    // Fetch the user and get the JWT secret stored in the database
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    // Verify the token using the user's dynamic JWT secret
    jwt.verify(token, user.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized: Invalid token');
      }
      
      // Attach the decoded token to the request object
      req.user = decoded;
      next();
    });
    
  } catch (error) {
    console.error('Token validation failed', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    return res.status(500).send('Internal server error');
  }
};

module.exports = validateToken;
