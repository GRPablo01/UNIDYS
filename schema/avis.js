const mongoose = require('mongoose');

// Schema Avis
const avisSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Modèle basé sur la collection 'avis'
const Avis = mongoose.model('Avis', avisSchema, 'avis');

module.exports = Avis;
