const mongoose = require('mongoose');

const activiteSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['ajout', 'modification', 'suppression', 'evaluation', 'validation', 'connexion']
  },
  description: { type: String, required: true },
  stagiaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Stagiaire' },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Activite', activiteSchema);