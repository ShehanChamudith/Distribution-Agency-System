const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/';

    // Check if the upload directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, filename); // Rename file with current timestamp
  }
});

// Initiate upload
const upload = multer({ storage: storage });

module.exports = { upload };
