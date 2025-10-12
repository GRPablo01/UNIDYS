const express = require('express');
const router = express.Router();
const eleveController = require('../controller/eleve.Controller');

// GET /api/eleves -> récupérer tous les élèves
router.get('/eleves', eleveController.getAllEleves);

// GET /api/eleves/:id -> récupérer un élève par ID
router.get('/eleves/:id', eleveController.getEleveById);

module.exports = router;
