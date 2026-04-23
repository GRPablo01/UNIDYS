const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

const QcmSchema = new mongoose.Schema({
  question: { type: String, required: true },

  options: {
    type: [String],
    default: []
  },

  reponse: { type: String, required: true }
});

module.exports = JeuBase.discriminator('qcm', QcmSchema);