const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    score: { type: Number, default: 0 }
  });
  
module.exports = mongoose.model('Eleve', eleveSchema);
