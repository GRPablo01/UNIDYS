const express = require('express');
const router = express.Router();
const User = require('../../schema/user'); // Mets le bon chemin

router.post('/create-admin', async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Un admin existe déjà.' });
    }

    // Créer un nouvel admin
    const admin = new User({
      nom,
      prenom,
      email,
      password,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin créé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l’admin', error });
  }
});

module.exports = router;
