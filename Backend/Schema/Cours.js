const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
  // ─── Identité ───
  titre: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  
  // ─── Auteur ───
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  
  // ─── Fichier ───
  pdfUrl: { type: String, required: true },

  
  // ─── Visuel ─── //
  couleur: { type: String, default: '#81ff90' },
  
  // ─── Vidéo ───
  video: {
    url: { type: String, trim: true },
   
  },

  // ─── Matière scolaire ───
matiere: {
  type: String,
  required: true,
  enum: [
    'francais',
    'mathematiques',
    'histoire',
    'geographie',
    'sciences',
    'anglais',
    'informatique',
    'arts',
    'eps',
    'musique',
    'autre'
  ],
  default: 'francais'
},
  
  // ─── Métadonnées ───
  key: { type: String, required: true, unique: true, index: true },
  niveau: { 
    type: String, 
    enum: ['debutant', 'intermediaire', 'avance'], 
    default: 'debutant' 
  },
  duree: { type: Number }, // durée estimée en minutes
  
  // ─── Catégorisation ─ //
  categorie: { type: String, trim: true },
  
  // ─── Dates ───
  dateCreation: { type: Date, default: Date.now, index: -1 },
}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Cours', CoursSchema);