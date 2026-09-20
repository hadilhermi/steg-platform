const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom est requis'], trim: true },
  prenom: { type: String, required: [true, 'Le prenom est requis'], trim: true },
  email: { 
    type: String, 
    required: [true, 'L email est requis'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: [true, 'Le mot de passe est requis'], minlength: 6 },
  role: { 
    type: String, 
    enum: ['admin', 'encadreur', 'stagiaire'], 
    default: 'encadreur' 
  },
  departement: { type: String, trim: true },
  telephone: { type: String },
  avatar: { type: String },
  actif: { type: Boolean, default: true },
  derniereConnexion: { type: Date }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);