// Utility script to initialize admin user in database
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

// Function to create default admin user
const initAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'niharika' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin user with username: niharika, password: 2006
    const admin = new Admin({
      username: 'niharika',
      password: '2006'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Username: niharika');
    console.log('Password: 2006');

  } catch (error) {
    console.error('Error initializing admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

// Run the initialization
initAdmin();
