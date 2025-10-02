// MongoDB schema for storing image metadata
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  // Image title or name
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Image description
  description: {
    type: String,
    default: ''
  },
  // Cloudinary URL of the uploaded image
  imageUrl: {
    type: String,
    required: true
  },
  // Cloudinary public ID for image management
  cloudinaryId: {
    type: String,
    required: true
  },
  // Category of the image (e.g., "wedding", "portrait", "landscape", "product")
  category: {
    type: String,
    required: true,
    enum: ['FEATURED',
      'WEDDING',
      'PRE-WEDDING',
      'CANDID',
      'BABY',
      'BABYSHOWER',
      'HALDI',
      'HALFSAREE',
      'BLACK & WHITE',
      'COUPLE',
      'PORTRAIT',
      'EVENT'
    ]
  },
  // Orientation of the image (portrait or landscape)
  orientation: {
    type: String,
    required: true,
    enum: ['portrait', 'landscape', 'square']
  },
  // Upload method (file or URL)
  uploadMethod: {
    type: String,
    enum: ['file', 'url'],
    default: 'file'
  },
  // Timestamp of when the image was uploaded
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries by category and orientation
imageSchema.index({ category: 1, orientation: 1 });

module.exports = mongoose.model('Image', imageSchema);
