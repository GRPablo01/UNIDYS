const mongoose = require('mongoose');

const qcmSchema = new mongoose.Schema({
  question: { type: String, required: true },
  reponses: { type: [String], required: true },
  bonneReponse: { type: Number, required: true },
  xp: { type: Number, default: 10 }
});

const coursSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  niveau: { type: String, required: true },
  matiere: { type: String, required: true },
  nomProf: { type: String, required: true },
  lienYoutube: { type: String, default: '' },
  fichierPdf: { type: String, required: true },
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qcms: { type: [qcmSchema], default: [] },
  dysTypes: { 
    type: [String], 
    enum: ['dyslexie', 'dyspraxie', 'dysphasie', 'dyscalculie', 'autre'], 
    default: [] 
  }, // <-- nouveau champ pour choisir la ou les DYS
}, {
  timestamps: true
});

module.exports = mongoose.model('Cours', coursSchema);
