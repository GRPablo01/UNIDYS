const express = require('express');
const router = express.Router();

// Schemas & Controllers
const User = require('../../Backend/Schema/user');
const userController = require('../Controller/user.controller');
const authController = require('../Controller/auth.controller');
const authMiddleware = require('../../Backend/middleware/auth');

// ================= AUTH =================

// Connexion
router.post('/login', authController.login);

// Utilisateur connecté
router.get('/me', authController.authenticate, authController.getCurrentUser);

// ================= UTILISATEURS =================

// Créer utilisateur
router.post('/users', userController.registerUser);

// Tous les utilisateurs
router.get('/users', userController.getAllUsers);

// Utilisateur par ID
router.get('/users/id/:id', userController.getUserById);

// ⚡ IMPORTANT (compatible Angular)
router.get('/email/:email', userController.getUserByEmail);

// Supprimer utilisateur
router.delete('/users/:id', userController.deleteUserById);

// ================= MODIFICATION UTILISATEUR =================

router.put('/users/:id', async (req, res) => {

  try {

    const { id } = req.params;
    const updates = req.body;

    let user = await User.findById(id);

    if (!user) {

      return res.status(404).json({
        message: 'Utilisateur introuvable'
      });

    }

    // Mise à jour automatique nomProf
    if (user.role === 'prof' && (updates.nom || updates.prenom)) {

      const nouveauNom = updates.nom || user.nom;
      const nouveauPrenom = updates.prenom || user.prenom;

      updates.nomProf = `${nouveauPrenom} ${nouveauNom}`;

    }

    user = await User.findByIdAndUpdate(id, updates, { new: true });

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

// Modifier mot de passe
router.put('/users/:id/password', userController.changePassword);

// ================= USER CARD =================

router.get('/card/:id', authMiddleware, userController.getUserCard);

// ================= CONTACTS =================

router.get('/contacts', async (req, res) => {

  try {

    const users = await User.find().select('-password');

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

// ================= AJOUT COURS ELEVE =================

router.post('/ajouter-cours', async (req, res) => {

  try {

    const { eleveKey, coursKey } = req.body;

    if (!eleveKey || !coursKey) {

      return res.status(400).json({
        message: 'eleveKey ou coursKey manquant'
      });

    }

    const user = await User.findOne({ eleveKey });

    if (!user) {

      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });

    }

    if (!user.cours.includes(coursKey)) {

      user.cours.push(coursKey);

      await user.save();

    }

    res.json({
      message: 'Cours ajouté',
      cours: user.cours
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }

});

// ================= COURS ELEVE =================

router.get('/users/cours/:eleveKey', async (req, res) => {

  const { eleveKey } = req.params;

  try {

    const utilisateur = await User.findOne({ eleveKey });

    if (!utilisateur) {

      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });

    }

    res.json(utilisateur.cours || []);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }

});

// ================= UPDATE USER =================

router.put('/update/:id', async (req, res) => {

  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {

      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });

    }

    res.json(updatedUser);

  } catch (err) {

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }

});

// ================= COOKIE =================

router.put('/cookie/:key', userController.updateCookieByKey);



// ================= RELATIONS =================
router.post('/relations', userController.addRelation);

module.exports = router;