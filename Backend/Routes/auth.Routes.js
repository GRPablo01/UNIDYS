const express = require('express');
const router = express.Router();
const User = require('../Schema/user');

// ================= VÉRIFIER EMAIL =================

router.post('/check-email', async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        exists: false,
        message: 'Email requis'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    res.json({
      exists: !!user
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      exists: false,
      message: 'Erreur serveur'
    });

  }
});

// ================= MOT DE PASSE OUBLIÉ =================

router.post('/forgot-password', async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        message: 'Email requis'
      });

    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {

      return res.status(404).json({
        message: 'Aucun compte associé à cet email'
      });

    }

    // ⚡ Simulation pour le moment
    // Ici tu pourras ajouter nodemailer + token

    res.json({
      message: 'Lien de réinitialisation envoyé'
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur lors de l'envoi"
    });

  }

});

module.exports = router;