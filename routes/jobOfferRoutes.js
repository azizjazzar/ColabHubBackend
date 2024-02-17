const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobOffer');


router.post('/add', JobController.createJobOffer);


router.get('/get', JobController.getAllJobOffers);

router.get('/:jobId', JobController.getJobOfferById);

router.put('/update/:jobId', JobController.updateJobOffer);

router.delete('/delete/:jobId', JobController.deleteJobOffer);

module.exports = router;
