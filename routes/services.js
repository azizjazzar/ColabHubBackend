const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.post('/addServices', servicesController.createService);
router.get('/services', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);
router.post('/purchase/:id', servicesController.purchaseService);

module.exports = router;

