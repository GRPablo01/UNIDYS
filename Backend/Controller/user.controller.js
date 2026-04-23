// ==============================
// 📦 IMPORTS
// ==============================
const User = require('../../Backend/Schema/user');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==============================
// 🔹 CONSTANTES CODES FIXES
// ==============================
const CODE_PROF = 'PROF2025';
const CODE_PARENT = 'PARENT2025';

// ==============================
// 🔹 DOSSIER UPLOAD
// ==============================
const uploadDir = path.join(__dirname, '../../uploads/profils');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==============================
// 🔹 MULTER
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }
}).single('photoProfil');

// ==============================
// 🔹 GENERATION CLE UNIQUE (garde pour key)
// ==============================
const generateKey = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let result = '';
  for (let i = 0; i < 5; i++) result += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 5; i++) result += numbers[Math.floor(Math.random() * numbers.length)];

  return result.split('').sort(() => Math.random() - 0.5).join('');
};

// ==============================
// 🔹 FILTRAGE USER
// ==============================
const filterUserFields = (user) => {
  const obj = user.toObject();

  const filtered = {
    _id: obj._id,
    nom: obj.nom,
    prenom: obj.prenom,
    email: obj.email,
    role: obj.role,
    key: obj.key,
    initiale: obj.initiale,
    photoProfil: obj.photoProfil,
    notifications: obj.notifications,
    font: obj.font,
    cguValide: obj.cguValide,
    cours: obj.cours,
    qcm: obj.qcm,
    cookie: obj.cookie,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };

  if (obj.role === 'eleve') {
    filtered.xp = obj.xp;
    filtered.dysListe = obj.dysListe;
  }

  if (obj.role === 'prof') {
    filtered.codeProf = obj.codeProf;
    filtered.eleveRelations = obj.eleveRelations;
  }

  if (obj.role === 'parent') {
    filtered.codeParent = obj.codeParent;
    filtered.eleveRelations = obj.eleveRelations;
  }

  return filtered;
};

// ==============================
// 🔹 INSCRIPTION UTILISATEUR
// ==============================
exports.registerUser = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { nom, prenom, email, password, role, parentId } = req.body;

      if (req.body.dysListe && typeof req.body.dysListe === 'string') {
        req.body.dysListe = JSON.parse(req.body.dysListe);
      }

      if (!nom || !prenom || !email || !password || !role) {
        return res.status(400).json({ message: 'Champs manquants' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const photoProfil = req.file ? `/uploads/profils/${req.file.filename}` : null;

      // 🔥 BASE COMMUNE
      let userData = {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        initiale: `${prenom[0].toUpperCase()}${nom[0].toUpperCase()}`,
        photoProfil,
        notifications: [],
        key: generateKey()
      };

      // 🔥 SELON ROLE
      if (role === 'eleve') {
        userData.dysListe = req.body.dysListe || [];
        userData.xp = 0;
      }

      if (role === 'parent') {
        userData.eleveRelations = [];
        userData.codeParent = CODE_PARENT; // ✅ FIXE
      }

      if (role === 'prof') {
        userData.eleveRelations = [];
        userData.codeProf = CODE_PROF; // ✅ FIXE
      }

      const user = new User(userData);

      // 🔗 LIEN PARENT → ELEVE
      if (role === 'eleve' && parentId) {
        const parent = await User.findById(parentId);
        if (parent && parent.role === 'parent') {
          parent.eleveRelations.push({
            nom,
            prenom,
            email,
            role: 'eleve'
          });
          await parent.save();
        }
      }

      await user.save();
      res.status(201).json(filterUserFields(user));

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
};

// ==============================
// 🔹 GET ALL USERS (LIGHT)
// ==============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const filteredUsers = users.map(u => ({
      _id: u._id,
      nom: u.nom,
      prenom: u.prenom,
      role: u.role,
      key: u.key,
      eleveRelations: u.eleveRelations || []
    }));

    res.json(filteredUsers);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔹 GET USER
// ==============================
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(filterUserFields(user));
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(filterUserFields(user));
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔹 DELETE USER
// ==============================
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔹 PASSWORD
// ==============================
exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Mot de passe manquant' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

    res.json({ message: 'Mot de passe mis à jour' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔹 USER CARD
// ==============================
exports.getUserCard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(filterUserFields(user));
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔹 COOKIE
// ==============================
exports.updateCookieByKey = async (req, res) => {
  try {
    const user = await User.findOne({ key: req.params.key });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.cookie = req.body.cookie;
    await user.save();

    res.json({ message: 'Cookie mis à jour' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔔 NOTIFICATIONS
// ==============================
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user?.notifications || []);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.notifications.push({
      message: req.body.message,
      time: "À l'instant",
      read: false,
      icon: req.body.icon,
      color: req.body.color,
      type: req.body.type
    });

    await user.save();
    res.json(user.notifications);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const notif = user.notifications.id(req.params.notifId);

    if (notif) notif.read = true;

    await user.save();
    res.json({ message: 'Notification mise à jour' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.notifications.forEach(n => n.read = true);

    await user.save();
    res.json({ message: 'Toutes les notifications sont lues' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    user.notifications.id(req.params.notifId)?.remove();

    await user.save();
    res.json({ message: 'Notification supprimée' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔗 RELATION
// ==============================
exports.addRelation = async (req, res) => {
  try {
    const { userKey, targetKey } = req.body;

    const user = await User.findOne({ key: userKey });
    const target = await User.findOne({ key: targetKey });

    if (!user || !target) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const exists = user.eleveRelations?.some(r => r.key === target.key);

    if (exists) {
      return res.status(400).json({ message: 'Relation déjà existante' });
    }

    user.eleveRelations.push({
      key: target.key,
      nom: target.nom,
      prenom: target.prenom,
      role: target.role
    });

    await user.save();

    res.json({ message: 'Relation ajoutée', user });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};