const express = require('express');
const router = express.Router();
const avisController = require('../controller/avis.controller');

router.get('/', avisController.getAvis);
router.post('/', avisController.postAvis);

module.exports = router;
