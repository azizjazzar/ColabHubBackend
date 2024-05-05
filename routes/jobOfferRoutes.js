const express = require("express");
const path = require("path");
const router = express.Router();
const JobController = require("../controllers/jobOffer");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() + path.extname(file.originalname)); // Save with timestamp
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.post(
  "/jobOffers/:jobId/apply",
  upload.single("cv"),
  JobController.applyToJobOffer
);

router.post("/add", JobController.createJobOffer);

router.get("/get", JobController.getAllJobOffers);

router.get("/get/:jobId", JobController.getJobOfferById);

router.put("/update/:jobId", JobController.updateJobOffer);

router.delete("/delete/:jobId", JobController.deleteJobOffer);

module.exports = router;
