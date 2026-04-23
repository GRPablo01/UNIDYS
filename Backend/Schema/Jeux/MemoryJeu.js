const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

const MemorySchema = new mongoose.Schema({
  cartes: [
    {
      id: Number,
      valeur: String
    }
  ]
});

module.exports = JeuBase.discriminator('memory', MemorySchema);