const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

const PuzzleSchema = new mongoose.Schema({
  mot: { type: String, required: true },

  lettresManquantes: {
    type: [String],
    default: []
  }
});

module.exports = JeuBase.discriminator('puzzle', PuzzleSchema);