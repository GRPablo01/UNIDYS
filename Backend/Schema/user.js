// ==============================
// 📦 Import des modules
// ==============================
const mongoose = require('mongoose');

// ==============================
// 🔹 Schéma principal utilisateur
// ==============================
const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['prof', 'eleve', 'parent'], required: true },

    photoProfil: { type: String, default: null },
    key: { type: String, unique: true },
    codeProf: { type: String, required: false },
    codeParent: { type: String, required: false },
    initiale: { type: String },

    cguValide: { type: Boolean, default: false },
    dysListe: { type: [String], default: [] },
    xp: { type: Number, default: 0 },

    cours: { type: [String], default: [] },

    // ==============================
    // 🎮 Remplacement des anciennes données
    // ==============================
    jeux: { type: [String], default: [] },
    exercices: { type: [String], default: [] },

    font: {
      type: String,
      enum: [
        'Arial',
        'Roboto',
        'Open Sans',
        'Comic Sans',
        'Times New Roman',
        'Lato',
        'Montserrat'
      ],
      default: 'Roboto'
    },

    cookie: {
      type: String,
      enum: ['accepted', 'refused', ''],
      default: ''
    },

    status: {
      enLigne: { type: Boolean, default: true },
      nePasDeranger: { type: Boolean, default: false },
      absent: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

// ==============================
// 🔹 Export du modèle
// ==============================
module.exports = mongoose.model('User', userSchema);