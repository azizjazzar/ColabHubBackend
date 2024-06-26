const Task = require('../models/Task');  // Assurez-vous que le chemin est correct

// Contrôleur pour créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour lire les tâches par ID de projet
exports.getTasksByProjectId = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    // Vérifiez si l'ID du projet est fourni dans la requête
    if (!projectId) {
      return res.status(400).json({ error: 'ID du projet non fourni' });
    }

    // Requête pour trouver les tâches liées à l'ID du projet
    const tasks = await Task.find({ projectId });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches par ID de projet :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



// Contrôleur pour récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer une tâche par son ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour une tâche par son ID
exports.updateTaskById = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer une tâche par son ID
exports.deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour lire les tâches par ID du freelanceur
exports.getTasksByFreelancerId = async (req, res, next) => {
  try {
    const freelancerId = req.params.freelancerId;

    // Vérifiez si l'ID du freelanceur est fourni dans la requête
    if (!freelancerId) {
      return res.status(400).json({ error: "ID du freelanceur non fourni" });
    }

    // Requête pour trouver les tâches liées à l'ID du freelanceur
    const tasks = await Task.find({ freelancerId });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches par ID du freelanceur :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};