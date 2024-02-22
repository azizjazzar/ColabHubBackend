const multer = require("multer");
const { diskStorage } = multer;
const { join, dirname } = require("path");

const storage = diskStorage({
  destination: (req, file, callback) => {
    const __dirname = dirname(__filename);
    callback(null, join(__dirname, "../public/images"));
  },
  filename: (req, file, callback) => {
    // Utiliser le nom de fichier d'origine sans aucune modification
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("images");

module.exports = upload;
