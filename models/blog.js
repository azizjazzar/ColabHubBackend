const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }
    ],
    dislikes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }
    ],
});

const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {  
        type: String,
        required: true, // La catégorie est maintenant requise
        enum: ['Web', 'Mobile', 'Design', 'Blockchain', 'Cybersecurity', 'Data Science', 'Cloud', 'Other'], // Définir les catégories acceptées
        default: 'Other', // Catégorie par défaut
    },
    
    date: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema], // Array to store comments
});

module.exports = mongoose.model('Blog', blogSchema);
