const Service = require('../models/Service');
// Importer la configuration de Multer

/*exports.createService = async (req, res) => {
    try {
        const newService = new Service(req.body);
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};*/

exports.createService = async (req, res) => {
    try {
        const newService = new Service({
            freelancerId: req.body.freelancerId,
            deliveryTime: req.body.deliveryTime,
            domaineExpertise: req.body.domaineExpertise,
            title: req.body.title,
            description: req.body.description,
            pricing: {
                starter: req.body.pricing.starter,
                standard: req.body.pricing.standard,
                advanced: req.body.pricing.advanced
            },
            images: [req.file.path] // Utilisez req.file pour obtenir le chemin de l'image téléchargée, et stockez-le dans un tableau
        });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getAllServices = async (req, res) => {
    try {
        const Services = await Service.find();
        res.json(Services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id); // Utilisez le modèle Service correctement
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const Service = await Service.findById(req.params.id);
        if (!Service) {
            return res.status(404).json({ message: "Service not found" });
        }
        Object.assign(Service, req.body);
        const updatedService = await Service.save();
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const Service = await Service.findById(req.params.id);
        if (!Service) {
            return res.status(404).json({ message: "Service not found" });
        }
        await Service.remove();
        res.json({ message: "Service deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.purchaseService = async (req, res) => {
    try {
        const Service = await Service.findById(req.params.id);
        if (!Service) {
            return res.status(404).json({ message: "Service not found" });
        }
        // Ajouter la logique de traitement de l'achat ici
        // Par exemple, enregistrer les détails de l'achat, mettre à jour le statut du projet, etc.
        res.json({ message: "Service purchased successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getServicesByDomain = async (req, res) => {
    try {
        const domain = req.params.domain; // Récupérez le domaine d'expertise à partir des paramètres de la requête
        const services = await Service.find({ domaineExpertise: domain }); // Recherchez les services correspondant au domaine d'expertise spécifié
        res.json(services); // Renvoyer les services trouvés en réponse
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
