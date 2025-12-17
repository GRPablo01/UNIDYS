// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();

// Controllers & Middleware
const userController = require('../controller/User.Controller');
const authController = require('../controller/auth.controller');
const authMiddleware = require('../../backend/middleware/auth'); // chemin correct

// Modèle User
const User = require('../Schéma/UserSchema'); // chemin vers le modèle Mongoose

// ================= ROUTES UTILISATEURS =================

// ✅ Créer un utilisateur
router.post('/users', userController.registerUser);

// ✅ Connexion
router.post('/login', authController.login);

// ✅ Récupérer l'utilisateur connecté
router.get('/users/me', authController.authenticate, authController.getCurrentUser);

// ✅ Récupérer un utilisateur par ID
router.get('/users/id/:id', userController.getUserById);

// ✅ Récupérer un utilisateur par email
router.get('/users/email/:email', userController.getUserByEmail);

// ✅ Récupérer tous les utilisateurs
router.get('/users', userController.getAllUsers);

// ✅ Supprimer un utilisateur par ID
router.delete('/users/:id', userController.deleteUserById);

// ✅ Modifier un utilisateur par ID (+ mise à jour nomProf si rôle 'prof')
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Si l'utilisateur est prof, mettre à jour nomProf automatiquement
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

// ✅ Modifier uniquement le mot de passe d’un utilisateur
router.put('/users/:id/password', userController.changePassword);



// ✅ Récupérer tous les contacts (liste des utilisateurs)
router.get('/contacts', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/users/ajouter-cours
router.post('/users/ajouter-cours', async (req, res) => {
  try {
    const { eleveKey, coursKey } = req.body;

    if (!eleveKey || !coursKey) {
      return res.status(400).json({ message: 'eleveKey ou coursKey manquant !' });
    }

    const user = await User.findOne({ Key: eleveKey });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // On évite les doublons
    if (!user.cours) user.cours = [];
    if (!user.cours.includes(coursKey)) {
      user.cours.push(coursKey);
      await user.save();
    }

    res.status(200).json({ message: 'Cours ajouté avec succès', cours: user.cours });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ GET /api/users/cours/:eleveKey
router.get('/users/cours/:eleveKey', async (req, res) => {
  const { eleveKey } = req.params;

  try {
    const utilisateur = await User.findOne({ Key: eleveKey });
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(utilisateur.cours || []); // renvoie un tableau de coursKey
  } catch (err) {
    console.error('[Backend] Erreur récupération cours utilisateur :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ PUT pour mettre à jour le cookie via n'importe quelle key
router.put('/users/cookie/:key', userController.updateCookieByKey);




module.exports = router;
