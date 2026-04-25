const mongoose = require('mongoose');
const JeuBase = require('./JeuBase');

// =====================
// 🃏 CARTE
// =====================
const CarteSchema = new mongoose.Schema({
  id: Number,

  valeur: {
    type: Number,
    required: function () {
      return this.parent().parent()?.type === 'nombres';
    }
  },

  couleur: { 
    type: String, 
    default: '#FFB3BA' 
  },

  image: {
    type: String,
    required: function () {
      return this.parent().parent()?.type === 'images';
    }
  },

  paireId: Number
});

// =====================
// 🧠 MEMORY GAME
// =====================
const MemorySchema = new mongoose.Schema({
  cartes: [CarteSchema]
});

module.exports = JeuBase.discriminator('memory', MemorySchema);