const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

const QcmSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },

  options: {
    type: [String],
    required: true
  },

  reponse: {
    type: String,
    required: true
  },

  indexReponse: {
    type: Number
  },

  couleur: { 
    type: String, 
    default: '#B9FBC0' 
  },

  difficulte: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    required: true
  }
});

module.exports = JeuBase.discriminator('qcm', QcmSchema);