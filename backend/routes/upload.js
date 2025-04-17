const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, adminAuth } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// @route   POST /api/upload
// @desc    Upload images
// @access  Private/Admin
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Get the URLs for the uploaded files
    const urls = req.files.map(file => {
      // In a production environment, you would upload to a CDN or cloud storage
      // and return the public URL. For this example, we'll return a relative path
      return `/uploads/${file.filename}`;
    });

    res.status(200).json({ 
      message: 'Files uploaded successfully',
      urls: urls
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 