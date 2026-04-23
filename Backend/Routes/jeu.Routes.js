const express = require('express');
const router = express.Router();
const jeuController = require('../Controller/jeu.Controller');

// 🎮 créer
router.post('/jeux', jeuController.createJeu);

// 📚 récupérer
router.get('/jeux/:prof', jeuController.getJeuxByProf);

module.exports = router;