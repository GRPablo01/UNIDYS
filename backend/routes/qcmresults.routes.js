// routes/qcmresults.js
const express = require('express');
const router = express.Router();
const QcmResult = require('../../schema/qcm'); // ton modèle Mongoose

// Vérifier si l'utilisateur a fait le QCM
router.get('/check/:qcmId/:userId', async (req, res) => {
  const { qcmId, userId } = req.params;

  try {
    const result = await QcmResult.findOne({ qcmId, userId });
    res.json({ fait: !!result }); // true si trouvé, false sinon
  } catch (err) {
    console.error(err);
    res.status(500).json({ fait: false });
  }
});

module.exports = router;
