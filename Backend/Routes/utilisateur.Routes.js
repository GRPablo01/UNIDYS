const express = require('express');
const router = express.Router();
const utilisateurController = require('../controller/utilisateur.controller');

router.get('/', utilisateurController.getUsers);
router.get('/joueurs', utilisateurController.getJoueurs);
router.get('/me', utilisateurController.getCurrentUser);
router.get('/:id', utilisateurController.getUserById);
router.put('/:id', utilisateurController.updateUser);
router.delete('/:id', utilisateurController.deleteUser);

module.exports = router;
