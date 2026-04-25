const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

const PuzzleSchema = new mongoose.Schema({
  mot: {
    type: String,
    required: true
  },

  motTroue: {
    type: String,
    required: true
  },

  lettresManquantes: {
    type: [String],
    default: []
  },

  positionsCachees: {
    type: [Number],
    default: []
  },

  couleur: { 
    type: String, 
    default: '#CDB4DB' 
  },

  difficulte: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    required: true
  }
});

module.exports = JeuBase.discriminator('puzzle', PuzzleSchema);