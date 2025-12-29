// ==============================
// 📦 Import des modules
// ==============================
const User = require('../../Backend/Schema/User');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 Mo max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Format non supporté (jpeg, jpg, png, webp)'));
  }
}).single('photoProfil');

// ==============================
// 🔑 Génération aléatoire de clé
// ==============================
function randomSuffix(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateKey() {
  const numberPart = Math.floor(Math.random() * 100000);
  const suffix = randomSuffix(5);
  return `${numberPart}${suffix}`;
}

// ==============================
// 📝 INSCRIPTION UTILISATEUR
// ==============================
exports.registerUser = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const {
        nom,
        prenom,
        email,
        password,
        role,
        initiale = '',
        cguValide = false,
        dysListe = [],
        theme = 'sombre',
        font = 'Roboto',
        luminosite = 100,
        codeProf = '',
        codeParent = '',
        cookie = ''
      } = req.body;

      if (!email || !password || !nom || !prenom || !role)
        return res.status(400).json({ message: 'Champs obligatoires manquants' });

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: 'Utilisateur déjà inscrit' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const key = generateKey();

      const photoProfil = req.file
        ? `/uploads/profils/${req.file.filename}`
        : null;

      // Construction de l'objet utilisateur
      const userData = {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        initiale: initiale || (prenom[0]?.toUpperCase() + nom[0]?.toUpperCase()),
        cguValide,
        dysListe: Array.isArray(dysListe) ? dysListe : [],
        key,
        codeProf,
        codeParent,
        photoProfil,
        theme,
        font,
        luminosite: Number(luminosite) || 100,
        cookie,
        status: { enLigne: true, nePasDeranger: false, absent: false }
      };

      const user = new User(userData);
      await user.save();

      // Préparer la réponse JSON
      const response = {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        photoProfil: user.photoProfil,
        initiale: user.initiale,
        cguValide: user.cguValide,
        dysListe: user.dysListe,
        xp: user.xp || 0,
        cours: user.cours || [],
        qcm: user.qcm || [],
        theme: user.theme,
        font: user.font,
        luminosite: user.luminosite,
        cookie: user.cookie,
        eleveRelations: user.eleveRelations || [],
        key: user.key,
        codeProf,
        codeParent,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        __v: user.__v
      };

      res.status(201).json(response);

    } catch (error) {
      console.error('❌ Erreur registerUser :', error);
      res.status(500).json({ message: 'Erreur serveur interne', error: error.message });
    }
  });
};

// ==============================
// 🔍 RÉCUPÉRER UN UTILISATEUR PAR EMAIL
// ==============================
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const response = {
      ...user.toObject(),
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      status: user.status
    };

    res.json(response);
  } catch (err) {
    console.error('Erreur getUserByEmail :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔍 RÉCUPÉRER UN UTILISATEUR PAR ID
// ==============================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const response = {
      ...user.toObject(),
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      status: user.status
    };

    res.json(response);
  } catch (err) {
    console.error('Erreur getUserById :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// ❌ SUPPRIMER UN UTILISATEUR
// ==============================
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    console.log('Utilisateur supprimé :', req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Erreur deleteUserById :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 📋 RÉCUPÉRER TOUS LES UTILISATEURS
// ==============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json(users.map(u => ({
      ...u.toObject(),
      luminosite: u.luminosite ?? 50,
      cookie: u.cookie ?? '',
      status: u.status
    })));
  } catch (err) {
    console.error('Erreur getAllUsers :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// ✏️ MODIFIER UN UTILISATEUR
// ==============================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) delete updates.password;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    console.log('Utilisateur mis à jour :', updatedUser.email);

    res.json({
      ...updatedUser.toObject(),
      luminosite: updatedUser.luminosite ?? 50,
      cookie: updatedUser.cookie ?? '',
      status: updatedUser.status
    });
  } catch (err) {
    console.error('Erreur updateUser :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🔐 CHANGER LE MOT DE PASSE
// ==============================
exports.changePassword = async (req, res) => {
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
    console.error('Erreur changePassword :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🎨 CHANGER LE THÈME
// ==============================
exports.changeTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { theme } = req.body;

    if (!['clair', 'sombre'].includes(theme))
      return res.status(400).json({ message: 'Thème invalide' });

    const user = await User.findByIdAndUpdate(id, { theme }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Thème mis à jour avec succès', theme: user.theme });
  } catch (err) {
    console.error('Erreur changeTheme :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🎨 CHANGER LA POLICE
// ==============================
exports.changeFont = async (req, res) => {
  try {
    const { id } = req.params;
    const { font } = req.body;

    const allowedFonts = ['Arial', 'Roboto', 'Open Sans', 'Comic Sans', 'Times New Roman', 'Lato', 'Montserrat'];
    if (!allowedFonts.includes(font))
      return res.status(400).json({ message: 'Police invalide' });

    const user = await User.findByIdAndUpdate(id, { font }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Police mise à jour avec succès', font: user.font });
  } catch (err) {
    console.error('Erreur changeFont :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🎨 CHANGER LA LUMINOSITÉ
// ==============================
exports.changeLuminosite = async (req, res) => {
  try {
    const { id } = req.params;
    let { luminosite } = req.body;

    luminosite = Number(luminosite);
    if (isNaN(luminosite) || luminosite < 0 || luminosite > 100) {
      return res.status(400).json({ message: 'Luminosité invalide (0-100)' });
    }

    const user = await User.findByIdAndUpdate(id, { luminosite }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Luminosité mise à jour avec succès', luminosite: user.luminosite });
  } catch (err) {
    console.error('Erreur changeLuminosite :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🃏 RÉCUPÉRER LA CARTE UTILISATEUR
// ==============================
exports.getUserCard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -cguValide');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const card = {
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      initiale: user.initiale,
      dysListe: user.dysListe,
      eleveRelations: user.eleveRelations,
      key: user.key,
      photoProfil: user.photoProfil,
      theme: user.theme,
      font: user.font,
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      status: user.status,
      codeProf: user.codeProf,
      codeParent: user.codeParent,
    };

    res.json(card);
  } catch (err) {
    console.error('Erreur getUserCard :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// ✏️ METTRE À JOUR LE COOKIE VIA key
// ==============================
exports.updateCookieByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { cookie } = req.body;

    if (!cookie)
      return res.status(400).json({ message: 'Valeur du cookie manquante' });

    const user = await User.findOne({ key });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.cookie = cookie; // 'accepted' ou 'refused'
    await user.save();

    res.json({ message: 'Cookie mis à jour', cookie: user.cookie });
  } catch (err) {
    console.error('Erreur updateCookieByKey :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
