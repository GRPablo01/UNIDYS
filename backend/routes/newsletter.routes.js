const express = require('express');
const router = express.Router();
const newsletterController = require('../controller/newsletter.controller');

// POST inscription
router.post('/newsletters', newsletterController.ajouterEmail);

// GET vérification
router.get('/newsletters/check', newsletterController.verifierEmail);

module.exports = router;
