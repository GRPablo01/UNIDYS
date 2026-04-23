const mongoose = require('mongoose');

const JeuBaseSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    type: { type: String, required: true }, // qcm, puzzle, texte, memory
    niveau: { type: String, required: true },
    difficulte: { type: String, required: true },
    consigne: { type: String },

    prof: { type: String, required: true }
  },
  { timestamps: true, discriminatorKey: 'type' }
);

module.exports = mongoose.model('JeuBase', JeuBaseSchema);