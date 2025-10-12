const mongoose = require('mongoose');

const qcmResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qcmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', required: true },
  score: { type: Number, required: true },
  reponses: { type: [Number], required: true },
  xpGagne: { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'qcmresults'
});

module.exports = mongoose.model('QcmResult', qcmResultSchema);
