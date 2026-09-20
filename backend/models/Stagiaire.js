const mongoose = require('mongoose');

const stagiaireSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom est requis'], trim: true },
  prenom: { type: String, required: [true, 'Le prenom est requis'], trim: true },
  email: { 
    type: String, 
    required: [true, 'L email est requis'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  telephone: { type: String },
  departement: { 
    type: String, 
    required: true,
    enum: ['Ingenierie', 'Commercial', 'RH', 'Finance', 'IT', 'Maintenance'],
    default: 'Ingenierie'
  },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: { 
    type: String, 
    enum: ['Actif', 'En attente', 'Termine', 'Suspendu'], 
    default: 'En attente' 
  },
  progression: { type: Number, default: 0, min: 0, max: 100 },
  note: { type: Number, min: 0, max: 20 },
  notes: { type: String, trim: true },
  encadreur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projet: { type: String, trim: true },
  universite: { type: String, trim: true },
  niveauEtude: { type: String, enum: ['Licence', 'Master', 'Ingenieur', 'Doctorat'] },
  avatar: { type: String },
  documents: [{ type: String }]
}, { timestamps: true });

// Index for search
stagiaireSchema.index({ nom: 'text', prenom: 'text', email: 'text' });

module.exports = mongoose.model('Stagiaire', stagiaireSchema);