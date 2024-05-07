const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobOffer");

const multer = require("multer");
const path = require("path"); // Ensure path module is required

const { verifyTokenMiddleware } = require("../middleware/auth");

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      // Correct use of path.extname to get file extension
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

router.get("/get", JobController.getAllJobOffers);

router.get("/get/:jobId", JobController.getJobOfferById);
router.get("/getFreelancersByJob/:jobId", JobController.getAllFreelancerByJob);

router.get("/freelancers/:freelancerId", JobController.getJobsForFreelancer);
router.delete("/delete/:jobId", JobController.deleteJobOffer);

router.post("/add", JobController.createJobOffer);

router.post("/add/:jobId/:freelancerId", JobController.addFreelancerToJobOffer);
router.put("/update/:jobId", JobController.updateJobOffer);

router.post(
  "/jobOffers/:jobId/apply",
  upload.single("cv"),
  JobController.applyToJobOffer
);

router.get(
  "/jobOffers/:jobId/applications",
  JobController.getJobOfferApplicationById
);

router.get(
  "/byowner/:userId",
  verifyTokenMiddleware,
  JobController.getJobOffersByOwner
);

module.exports = router;
