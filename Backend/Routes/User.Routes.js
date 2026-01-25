// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const path = require('path');

// Schemas & Controllers
const User = require('../../Backend/Schema/User'); // Assure-toi que le chemin est correct
const userController = require('../controller/User.Controller');
const authController = require('../controller/auth.controller');
const authMiddleware = require('../../backend/middleware/auth'); // renomme correctement

// ================= ROUTES UTILISATEURS =================

// ✅ Créer un utilisateur
router.post('/users', userController.registerUser);

// ✅ Connexion
router.post('/login', authController.login);

// ✅ Récupérer l'utilisateur connecté
router.get('/me', authController.authenticate, authController.getCurrentUser);

// ✅ Récupérer un utilisateur par ID
router.get('/users/id/:id', userController.getUserById);

// ✅ Récupérer tous les utilisateurs
router.get('/user', userController.getAllUsers);

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

// ✅ Récupérer un utilisateur par email
router.get('/users/:email', userController.getUserByEmail);

// ✅ Récupérer la carte complète de l’utilisateur par ID (avec auth)
router.get('/card/:id', authMiddleware, userController.getUserCard);

// ✅ Récupérer tous les contacts (liste des utilisateurs)
router.get('/contacts', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/ajouter-cours
router.post('/ajouter-cours', async (req, res) => {
  try {
    const { eleveKey, coursKey } = req.body;

    if (!eleveKey || !coursKey) {
      return res.status(400).json({ message: 'eleveKey ou coursKey manquant !' });
    }

    const user = await User.findOne({ eleveKey });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // On évite les doublons
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
// Nouvelle route corrigée pour éviter conflit avec /users/:email
router.get('/users/cours/:eleveKey', async (req, res) => {
  const { eleveKey } = req.params;

  try {
    const utilisateur = await User.findOne({ eleveKey });
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(utilisateur.cours || []); // renvoie un tableau de coursKey
  } catch (err) {
    console.error('[Backend] Erreur récupération cours utilisateur :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/users/update/:id
router.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // renvoie le document mis à jour
    );
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// PUT pour mettre à jour le cookie via n'importe quelle key
router.put('/cookie/:key', userController.updateCookieByKey);



module.exports = router;
