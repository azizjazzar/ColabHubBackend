const Consultation = require('../models/consultation');

exports.createConsultation = async (req, res) => {
    try {
        const newConsultation = new Consultation(req.body);
        const savedConsultation = await newConsultation.save();
        res.status(201).json(savedConsultation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.find();
        res.json(consultations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getConsultationById = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.json(consultation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        Object.assign(consultation, req.body);
        const updatedConsultation = await consultation.save();
        res.json(updatedConsultation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        await consultation.remove();
        res.json({ message: "Consultation deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.reserveConsultation = async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        // Ajouter une logique pour gérer la réservation
        // Par exemple, modifier le statut, ajouter l'ID de l'utilisateur qui réserve, etc.
        consultation.statut = "Réservée"; // Exemple simple
        const updatedConsultation = await consultation.save();
        res.json(updatedConsultation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
