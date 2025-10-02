// MongoDB schema for admin user authentication
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Admin username
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Hashed password for security
  password: {
    type: String,
    required: true
  },
  // Date when admin account was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving to database
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
