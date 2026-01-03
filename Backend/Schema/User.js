const mongoose = require('mongoose');

// 🔹 Schéma principal utilisateur
const userSchema = new mongoose.Schema(
  {
    // =============================
    // 🔹 Informations de base
    // =============================
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['prof', 'eleve', 'parent'], required: true },

    // =============================
    // 🔹 Profil
    // =============================
    photoProfil: { type: String, default: null },
    initiale: { type: String },

    // 🔹 Clé unique selon le rôle
    key: { type: String, default: null },
    codeProf: { type: String },
    codeParent: { type: String },

    // =============================
    // 🔹 Préférences
    // =============================
    theme: { type: String, enum: ['clair', 'sombre'], default: 'sombre' },
    font: { 
      type: String, 
      enum: ['Arial', 'Roboto', 'Open Sans', 'Comic Sans', 'Times New Roman', 'Lato', 'Montserrat'], 
      default: 'Roboto' 
    },
    luminosite: { type: Number, min: 0, max: 100, default: 50 },

    // =============================
    // 🔹 Données éducatives
    // =============================
    dysListe: { type: [String], default: [] },
    xp: { type: Number, default: 0 },
    cours: [{ type: String }],
    qcm: [{ type: String }],

    // =============================
    // 🔹 Abonnements & Suivis
    // =============================

    // Comptes que l'utilisateur suit
    abonnements: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['prof', 'eleve', 'parent'] }
      }
    ],

    // Comptes qui suivent l'utilisateur
    suivis: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['prof', 'eleve', 'parent'] }
      }
    ],

    // =============================
    // 🔹 Cookies & Statuts
    // =============================
    cookie: {
      type: String,
      enum: ['accepted', 'refused', ''],
      default: ''
    },

    status: {
      enLigne: { type: Boolean, default: true },
      nePasDeranger: { type: Boolean, default: false },
      absent: { type: Boolean, default: false }
    },

    compte: {
      type: String,
      enum: ['actif', 'desactive', 'supprime'],
      default: 'actif'
    },

    cguValide: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
