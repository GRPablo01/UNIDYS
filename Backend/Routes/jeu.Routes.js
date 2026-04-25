const express = require('express');
const router = express.Router();
const jeuController = require('../Controller/jeu.Controller');

// 🎮 créer un jeu
router.post('/jeux', jeuController.createJeu);

// 📚 récupérer tous les jeux
router.get('/jeux', jeuController.getAllJeux);

// 📄 récupérer un jeu par ID (optionnel mais utile)
router.get('/jeux/:id', jeuController.getJeuById);

// ✏️ modifier un jeu (optionnel)
router.put('/jeux/:id', jeuController.updateJeu);

// 🗑️ supprimer un jeu (optionnel)
router.delete('/jeux/:id', jeuController.deleteJeu);

module.exports = router;