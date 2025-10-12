const express = require('express');
const router = express.Router();
const User = require('../../schema/user'); // Assure-toi que le chemin est correct
const userController = require('../controller/user.Controller');
const authController = require('../controller/auth.controller');

// ================= ROUTES UTILISATEURS =================

// ✅ Créer un utilisateur
router.post('/users', userController.registerUser);

// ✅ Connexion
router.post('/login', authController.login);

// ✅ Récupérer un utilisateur par email
router.get('/users/:email', userController.getUserByEmail);

// ✅ Supprimer un utilisateur par ID
router.delete('/users/:id', userController.deleteUserById);

// ✅ Modifier un utilisateur par ID (+ mise à jour du nomProf si prof)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Si c’est un prof, on met à jour nomProf automatiquement
    if (user.role === 'prof' && (updates.nom || updates.prenom)) {
      const nouveauNom = updates.nom || user.nom;
      const nouveauPrenom = updates.prenom || user.prenom;
      updates.nomProf = `${nouveauPrenom} ${nouveauNom}`;
    }

    user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Récupérer tous les utilisateurs
router.get('/unidys/users', userController.getAllUsers);

// ✅ Ajouter de l’XP à un utilisateur
router.post('/users/:id/ajouterXP', async (req, res) => {
  const { id } = req.params;
  const { xp } = req.body;

  if (!xp || xp <= 0) return res.status(400).json({ message: 'XP invalide' });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    user.xp = (user.xp || 0) + xp;
    await user.save();

    res.json({ updatedXP: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Modifier uniquement le mot de passe d’un utilisateur
router.put('/users/:id/password', userController.changePassword);

module.exports = router;
