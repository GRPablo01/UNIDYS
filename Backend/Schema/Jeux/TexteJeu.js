const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

// =====================
// MOT
// =====================
const MotSchema = new mongoose.Schema({
  id: Number,
  mot: { type: String, required: true },

  couleur: { 
    type: String, 
    default: '#A0C4FF' 
  }
});

// =====================
// PHRASE GAME
// =====================
const PhraseJeuSchema = new mongoose.Schema({
  phraseOriginale: {
    type: String,
    required: true
  },

  motsMelanges: [MotSchema],

  difficulte: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    required: true
  }
});

module.exports = JeuBase.discriminator('phrasejeux', PhraseJeuSchema);