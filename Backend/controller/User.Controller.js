// ==================================================
// 📦 controllers/UserController.js
// ==================================================

const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// ==============================
// 📄 Import des schémas Mongoose
// ==============================
const { UserSchema } = require('../Schéma/UserSchema');
const { ProfSchema } = require('../Schéma/ProfSchema');
const { ParentSchema } = require('../Schéma/ParentSchema');
const { EleveSchema } = require('../Schéma/EleveSchema');

// ==============================
// 📁 Création des modèles à partir des schémas
// ==============================
const User = mongoose.model('User', UserSchema);
const Prof = mongoose.model('Prof', ProfSchema);
const Parent = mongoose.model('Parent', ParentSchema);
const Eleve = mongoose.model('Eleve', EleveSchema);

// ==============================
// 📁 Configuration du dossier uploads/profils
// ==============================
const uploadDir = path.join(__dirname, '../../uploads/profils');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ==============================
// 🖼️ Configuration Multer pour upload images
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Format non supporté (jpeg, jpg, png, webp)'));
  }
}).single('avatar');

// ==============================
// 🔑 Génération aléatoire de clés
// ==============================
function randomSuffix(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function generateKey() {
  const numberPart = Math.floor(Math.random() * 100000);
  const suffix = randomSuffix(5);
  return `${numberPart}${suffix}`;
}

// ==============================
// 🔄 Fonction utilitaire : récupérer user + role
// ==============================
const getUserWithRoleData = async (filter) => {
  const user = await User.findOne(filter).select('-password');
  if (!user) return null;

  let roleData = null;
  switch (user.role) {
    case 'eleve':
      roleData = await Eleve.findOne({ userId: user._id });
      break;
    case 'prof':
      roleData = await Prof.findOne({ userId: user._id });
      break;
    case 'parent':
      roleData = await Parent.findOne({ userId: user._id });
      break;
  }

  return { ...user.toObject(), roleData: roleData ? roleData.toObject() : null };
};

// ==============================
// 📝 INSCRIPTION UTILISATEUR
// ==============================
const registerUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const {
        nom,
        prenom,
        email,
        password,
        role,
        initiales = '',
        cguValide = false,
        dysListe = [],
        theme = 'clair',
        police = 'Roboto',
        luminosite = '100',
        codeProf = '',
        codeParent = ''
      } = req.body;

      if (!nom || !prenom || !email || !password || !role)
        return res.status(400).json({ message: 'Champs obligatoires manquants' });

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà inscrit' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatar = req.file ? `/uploads/profils/${req.file.filename}` : null;
      const userKey = generateKey();

      // 🔹 Création du User
      const newUser = new User({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        initiales: initiales || (prenom[0]?.toUpperCase() + nom[0]?.toUpperCase()),
        avatar,
        cguValide,
        Key: userKey,
        theme,
        police,
        luminosite,
        cookie: false, // vide à la création
      });

      await newUser.save();

      let roleData = null;

      switch (role) {
        case 'eleve':
          roleData = new Eleve({
            name: `${nom} ${prenom}`,   // Nom complet
            Key: userKey,               // Clé unique
            dysListe: Array.isArray(dysListe) ? dysListe : [],
            xp: 0,
            cours: [],
            qcm: [],
            suivi: [],
            abonnement: []
          });
          await roleData.save();
          break;

        case 'prof':
          roleData = new Prof({
            name: `${nom} ${prenom}`,   // Nom complet
            Key: userKey,               // Clé unique
            codeProf: codeProf || generateKey(),
            matieres: [],
            coursCrees: [],
            qcmCrees: [],
            suivi: [],                  // Si tu veux suivre des élèves ou parents
            abonnement: []              // Si tu veux stocker des abonnements
          });
          await roleData.save();
          break;

        case 'parent':
          roleData = new Parent({
            name: `${nom} ${prenom}`,   // Nom complet
            Key: userKey,               // Clé unique
            codeParent: codeParent || generateKey(),
            enfants: [],
            suivi: [],                  // Si tu veux suivre des élèves
            abonnement: []              // Si tu veux stocker des abonnements
          });
          await roleData.save();
          break;

        default:
          return res.status(400).json({ message: 'Rôle invalide' });
      }


      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: newUser,
        roleData
      });
    } catch (error) {
      console.error('❌ Erreur registerUser :', error);
      res.status(500).json({ message: 'Erreur serveur interne', error: error.message });
    }
  });
};


// ==============================
// 🔍 RÉCUPÉRER UN UTILISATEUR PAR EMAIL
// ==============================
const getUserByEmail = async (req, res) => {
  try {
    const userWithRole = await getUserWithRoleData({ email: req.params.email });
    if (!userWithRole) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(userWithRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔍 RÉCUPÉRER UN UTILISATEUR PAR ID
// ==============================
const getUserById = async (req, res) => {
  try {
    const userWithRole = await getUserWithRoleData({ _id: req.params.id });
    if (!userWithRole) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(userWithRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// ❌ SUPPRIMER UN UTILISATEUR
// ==============================
const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    switch (deletedUser.role) {
      case 'eleve': await Eleve.deleteOne({ userId: deletedUser._id }); break;
      case 'prof': await Prof.deleteOne({ userId: deletedUser._id }); break;
      case 'parent': await Parent.deleteOne({ userId: deletedUser._id }); break;
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// ✏️ MODIFIER UN UTILISATEUR
// ==============================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.password;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Fusion roleData
    const roleData = await (updatedUser.role === 'eleve' ? Eleve.findOne({ userId: id }) :
      updatedUser.role === 'prof' ? Prof.findOne({ userId: id }) :
        updatedUser.role === 'parent' ? Parent.findOne({ userId: id }) :
          null);

    res.json({ ...updatedUser.toObject(), roleData: roleData ? roleData.toObject() : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔐 CHANGER LE MOT DE PASSE
// ==============================
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Ancien mot de passe incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔍 RÉCUPÉRER TOUS LES UTILISATEURS
// ==============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const usersWithRoles = await Promise.all(users.map(async user => {
      let roleData = null;
      switch (user.role) {
        case 'eleve': roleData = await Eleve.findOne({ userId: user._id }); break;
        case 'prof': roleData = await Prof.findOne({ userId: user._id }); break;
        case 'parent': roleData = await Parent.findOne({ userId: user._id }); break;
      }
      return { ...user.toObject(), roleData: roleData ? roleData.toObject() : null };
    }));

    res.json(usersWithRoles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔄 Mettre à jour le cookie via une key
// ==============================
const updateCookieByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { cookie } = req.body;

    const user = await User.findOne({ Key: key });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.cookie = cookie;
    await user.save();

    res.json({ message: 'Cookie mis à jour', cookie: user.cookie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 📤 EXPORTS
// ==============================
module.exports = {
  registerUser,
  getUserByEmail,
  getUserById,
  deleteUserById,
  updateUser,
  changePassword,
  getAllUsers,
  updateCookieByKey
};
