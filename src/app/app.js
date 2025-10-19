// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connecté');
}).catch(err => console.error('❌ Erreur MongoDB :', err));

// Route login
const authRoutes = require('../../backend/routes/auth.routes');
app.use('/api/unidys', authRoutes); // <-- important

module.exports = app;
