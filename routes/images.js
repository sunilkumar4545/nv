// API routes for image CRUD operations
const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');
const upload = require('../middlewares/upload');
const { isAuthenticated, validateAdminSession } = require('../middlewares/auth');

// GET all images (public route for gallery)
router.get('/', async (req, res) => {
  try {
    const { category, orientation } = req.query;
    let filter = {};

    // Filter by category if provided
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Filter by orientation if provided
    if (orientation && orientation !== 'all') {
      filter.orientation = orientation;
    }

    // Fetch images from database with filters
    const images = await Image.find(filter).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      images
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching images'
    });
  }
});

// POST upload multiple images from files (protected route)
router.post('/upload-multiple', isAuthenticated, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { category, orientation } = req.body;
    
    if (!category || !orientation) {
      return res.status(400).json({
        success: false,
        message: 'Category and orientation are required for all images'
      });
    }

    const uploadedImages = [];
    const uploadPromises = [];

    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'photographer_portfolio',
            resource_type: 'image'
          },
          async (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error for file ${i + 1}:`, error);
              reject(error);
              return;
            }

            // Create image record
            const newImage = new Image({
              title: `Image ${i + 1}`,
              description: '',
              imageUrl: result.secure_url,
              cloudinaryId: result.public_id,
              category,
              orientation,
              uploadMethod: 'file'
            });

            try {
              await newImage.save();
              resolve(newImage);
            } catch (dbError) {
              console.error(`Database save error for file ${i + 1}:`, dbError);
              reject(dbError);
            }
          }
        );

        uploadStream.end(file.buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete
    try {
      const results = await Promise.all(uploadPromises);
      uploadedImages.push(...results);

      res.json({
        success: true,
        message: `${uploadedImages.length} images uploaded successfully`,
        images: uploadedImages,
        totalUploaded: uploadedImages.length
      });
    } catch (uploadError) {
      console.error('Multiple upload error:', uploadError);
      res.status(500).json({
        success: false,
        message: 'Some images failed to upload',
        error: uploadError.message
      });
    }

  } catch (error) {
    console.error('Multiple upload route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing multiple uploads'
    });
  }
});

// POST upload single image from file (protected route)
router.post('/upload-file', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, description, category, orientation } = req.body;

    // Upload image to Cloudinary using buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'photographer_portfolio',
        resource_type: 'image'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Error uploading to Cloudinary'
          });
        }

        // Save image metadata to database
        const newImage = new Image({
          title,
          description,
          imageUrl: result.secure_url,
          cloudinaryId: result.public_id,
          category,
          orientation,
          uploadMethod: 'file'
        });

        await newImage.save();

        res.json({
          success: true,
          message: 'Image uploaded successfully',
          image: newImage
        });
      }
    );

    // Pipe the buffer to Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image'
    });
  }
});

// POST upload image from URL (protected route)
router.post('/upload-url', isAuthenticated, async (req, res) => {
  try {
    const { imageUrl, title, description, category, orientation } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    // Upload image to Cloudinary from URL
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'photographer_portfolio'
    });

    // Save image metadata to database
    const newImage = new Image({
      title,
      description,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      category,
      orientation,
      uploadMethod: 'url'
    });

    await newImage.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: newImage
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image from URL'
    });
  }
});

// DELETE image by ID (protected route)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinaryId);

    // Delete image from database
    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image'
    });
  }
});

// GET image categories (public route)
router.get('/categories', async (req, res) => {
  try {
    // Get distinct categories from database
    const categories = await Image.distinct('category');
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

module.exports = router;
