// Authentication routes for admin login and logout
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// POST route to handle login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });

    // Check if admin exists and password is correct
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Set session as authenticated
    req.session.isAuthenticated = true;
    req.session.adminId = admin._id;

    res.json({
      success: true,
      message: 'Login successful',
      redirectUrl: '/admin'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// POST route to handle logout
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// GET route to check authentication status
router.get('/check', (req, res) => {
  res.json({
    isAuthenticated: req.session && req.session.isAuthenticated
  });
});

module.exports = router;
