const express = require('express');
const upload = require("../middleware/multer-config.js"); // Utilisez require() pour importer le middleware
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.post('/addServices', upload, servicesController.createService); // Utilisez le middleware multer pour gérer le téléchargement d'images
router.get('/services', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);
router.post('/purchase/:id', servicesController.purchaseService);
// Ajouter un nouvel endpoint pour trier les services par domaine d'expertise
router.get('/byDomain/:domain', servicesController.getServicesByDomain);
router.get('/byFreelancer/:freelancerId', servicesController.getServicesByFreelancerId);

module.exports = router;
