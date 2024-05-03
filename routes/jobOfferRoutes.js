const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobOffer');





router.get('/get', JobController.getAllJobOffers);

router.get('/get/:jobId', JobController.getJobOfferById);
router.get('/getFreelancersByJob/:jobId', JobController.getAllFreelancerByJob);

router.get('/freelancers/:freelancerId', JobController.getJobsForFreelancer);
router.delete('/delete/:jobId', JobController.deleteJobOffer);

router.post('/add', JobController.createJobOffer);
module.exports = router;
