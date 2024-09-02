const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const signupRoutes = require('./Routes/SignupRoute');
const loginRoutes = require('./Routes/LoginRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth/signup', signupRoutes);
app.use('/api/auth/login', loginRoutes);

// Global Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORTS || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
