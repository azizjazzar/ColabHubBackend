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
    const __dirname = dirname(__filename);
    callback(null, join(__dirname, "../public/images"));
  },
  filename: (req, file, callback) => {
    // Générer un nom de fichier unique sans le timestamp et l'extension supplémentaire
    const extension = MIME_TYPES[file.mimetype];
    const nomFichierSansExtension = file.originalname.split(" ").join("_").split(".").slice(0, -1).join(".");
    callback(null, nomFichierSansExtension + "_" + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("images");

module.exports = upload;
