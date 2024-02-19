const multer = require("multer");
const { diskStorage } = multer;
const { join, dirname } = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = diskStorage({
  destination: (req, file, callback) => {
    const __dirname = dirname(__filename); // Utilisez __dirname au lieu de import.meta.url
    callback(null, join(__dirname, "../public/images"));
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("images");

module.exports = upload;
