const mongoose = require('mongoose');

const JeuBaseSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },

    // ⚠️ utilisé UNIQUEMENT par discriminator
    type: { type: String, required: true },

    niveau: { type: String, required: true },
    difficulte: { type: String, required: true },

    consigne: { type: String },

    prof: { type: String, required: true }
  },
  {
    timestamps: true,
    discriminatorKey: 'type' // 👈 clé centrale
  }
);

module.exports = mongoose.model('JeuBase', JeuBaseSchema);