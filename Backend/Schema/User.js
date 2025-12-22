const mongoose = require('mongoose');

// 🔹 Schéma des relations de l'élève (prof ou parent lié)
const eleveRelationSchema = new mongoose.Schema({
  role: { type: String, enum: ['prof', 'parent'], required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true }
});

// 🔹 Schéma principal utilisateur
const userSchema = new mongoose.Schema(
  {
    // Informations de base
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['prof', 'eleve', 'parent'], required: true },

    // Photo de profil
    photoProfil: { type: String, default: null },

    // Codes d’association / clés uniques
    eleveKey: { type: String, default: null },
    profKey: { type: String, default: null },
    parentKey: { type: String, default: null },
    codeProf: { type: String, default: null },   // pour associer élèves → prof
    codeParent: { type: String, default: null }, // pour associer élèves → parent

    // Autres informations
    initiale: { type: String },
    cguValide: { type: Boolean, default: false },
    dysListe: { type: [String], default: [] },

    // Système de progression
    xp: { type: Number, default: 0 },

    // 🔹 Modification : cours et qcm deviennent des strings (clé) au lieu d’ObjectId
    cours: [{ type: String, default: [] }], // stocke coursKey directement
    qcm: [{ type: String, default: [] }],   // stocke qcmKey directement

    // 🔹 Gestion du thème
    theme: { type: String, enum: ['clair', 'sombre'], default: 'sombre' },

    // 🔹 Choix de la police
    font: { 
      type: String, 
      enum: ['Arial', 'Roboto', 'Open Sans', 'Comic Sans', 'Times New Roman', 'Lato', 'Montserrat'], 
      default: 'Roboto' 
    },

    // 🔹 Intensité de lumière (0 à 100)
    luminosite: { type: Number, min: 0, max: 100, default: 50 },

    // 🔹 Relations élève (si rôle = élève)
    eleveRelations: { type: [eleveRelationSchema], default: [] },

    // 🔹 ✅ COOKIE
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

module.exports = mongoose.model('User', userSchema);
