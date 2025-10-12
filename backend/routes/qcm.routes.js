const express = require('express');
const router = express.Router();
const qcmController = require('../controller/qcm.controller');

router.post('/resultats', qcmController.saveResult);
router.get('/resultats/:coursId/:userId', qcmController.getResultByUserAndCours);
router.get('/results/user/:userId', qcmController.getResultsByUser);

module.exports = router;
