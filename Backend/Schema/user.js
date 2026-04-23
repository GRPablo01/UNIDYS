// ==============================
// 📦 Import des modules
// ==============================
const mongoose = require('mongoose');

// ==============================
// 🔹 Schéma des relations de l'élève (prof ou parent lié)
// ==============================
const eleveRelationSchema = new mongoose.Schema({
  role: { type: String, enum: ['prof', 'parent'], required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true }
});

// ==============================
// 🔔 Schéma Notification
// ==============================
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: String, required: true },
  read: { type: Boolean, default: false },
  icon: { type: String, default: null },
  color: { type: String, default: null },
  type: { type: String, enum: ['info','success','warning','error'], default: 'info' }
}, { timestamps: true });

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
    cours: [{ type: String, default: [] }],
    qcm: [{ type: String, default: [] }],

    // ❌ SUPPRIMÉ : theme
    // ❌ SUPPRIMÉ : luminosite

    font: { type: String, enum: ['Arial','Roboto','Open Sans','Comic Sans','Times New Roman','Lato','Montserrat'], default: 'Roboto' },
    eleveRelations: { type: [eleveRelationSchema], default: [] },
    cookie: { type: String, enum: ['accepted','refused',''], default: '' },
    status: {
      enLigne: { type: Boolean, default: true },
      nePasDeranger: { type: Boolean, default: false },
      absent: { type: Boolean, default: false }
    },
    notifications: { type: [notificationSchema], default: [] } // 🔔 Notifications
  },
  { timestamps: true }
);

// 🔹 Export du modèle
module.exports = mongoose.model('User', userSchema);