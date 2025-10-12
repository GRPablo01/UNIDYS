const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['prof', 'eleve', 'admin'], default: 'eleve' },
  codeProf: { type: String },
  initiale: { type: String },
  xp: { type: Number, default: 0 },
  // ✅ Nouveau champ pour savoir si l'utilisateur a validé les CGU
  cguValide: { type: Boolean, default: true }
});

// Génération des initiales
utilisateurSchema.pre('save', function (next) {
  if (this.nom && this.prenom) {
    this.initiale = (this.prenom[0] + this.nom[0]).toUpperCase();
  }
  next();
});

// Hash du mot de passe
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Vérification du mot de passe
utilisateurSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', utilisateurSchema);
