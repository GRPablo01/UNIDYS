const express = require('express');
const router = express.Router();
const User = require('../../schema/user');
const authMiddleware = require('../middleware/auth');

// ✅ Mise à jour du profil utilisateur
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, prenom, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { nom, prenom, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Profil mis à jour !', user: updatedUser });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// ✅ Récupérer un utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

module.exports = router;
