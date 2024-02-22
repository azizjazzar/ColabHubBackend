const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobOffer');


router.post('/add', JobController.createJobOffer);


router.get('/get', JobController.getAllJobOffers);

router.get('/get/:jobId', JobController.getJobOfferById);

router.put('/update/:jobId', JobController.updateJobOffer);

// Route pour lire les tâches par ID de projet
router.get('/get/:userId', JobController.getJobByProjectId );


router.delete('/delete/:jobId', JobController.deleteJobOffer);

module.exports = router;
