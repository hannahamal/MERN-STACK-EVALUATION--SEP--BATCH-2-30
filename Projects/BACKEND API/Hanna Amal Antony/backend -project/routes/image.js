const express = require('express');
const multer = require('multer');
const path = require('path');
var router = express.Router();




const app = express();


// Configure Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use the original filename or customize it
    cb(null, Date.now() + path.extname(file.originalname)); // Appending the timestamp for uniqueness
  }
});

const upload = multer({ storage });

// Define the upload route
router.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'No file uploaded'
    });
  }
  if(req.file)
  res.json({
    status: 'success',
    message: 'File uploaded successfully',
    file: req.file // Include file details in the response if needed
  });
});

module.exports=router;