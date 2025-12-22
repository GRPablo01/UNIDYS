// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../../Backend/Schema/User');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'UNIDYS_SECRET';

// ==============================
// 🔑 LOGIN
// ==============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // ⚡ Création du token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // ==============================
    // 🎯 Construction dynamique selon le rôle
    // ==============================
    const baseUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      initiale: user.initiale || `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
      photoProfil: user.photoProfil || '',
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      cguValide: user.cguValide ?? false,
    };

    // Ajout des données spécifiques
    if (user.role === 'eleve') {
      baseUser.eleveKey = user.eleveKey || null;
      
      baseUser.dysListe = user.dysListe || [];
      baseUser.eleveRelations = user.eleveRelations || [];
      baseUser.xp = user.xp || 0;
    }

    if (user.role === 'prof') {
      baseUser.profKey = user.profKey || null;
      baseUser.cours = user.cours || [];
      baseUser.qcm = user.qcm || [];
    }

    if (user.role === 'parent') {
      baseUser.parentKey = user.parentKey || null;
      baseUser.codeParent = user.codeParent || '';
      baseUser.eleveRelations = user.eleveRelations || [];
    }

    // 🔥 On renvoie uniquement l'essentiel
    res.status(200).json({ user: baseUser });

  } catch (error) {
    console.error('Erreur login :', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🛡️ Middleware JWT
// ==============================
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token invalide' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token invalide' });
    req.userId = decoded.id;
    next();
  });
};

// ==============================
// 👤 Récupérer l'utilisateur connecté
// ==============================
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const baseUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      initiale: user.initiale || `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
      photoProfil: user.photoProfil || '',
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      cguValide: user.cguValide ?? false,
    };

    // Ajout des données spécifiques
    if (user.role === 'eleve') {
      baseUser.eleveKey = user.eleveKey || null;
      baseUser.codeProf = user.codeProf || '';
      baseUser.dysListe = user.dysListe || [];
      baseUser.eleveRelations = user.eleveRelations || [];
      baseUser.xp = user.xp || 0;
    }

    if (user.role === 'prof') {
      baseUser.profKey = user.profKey || null;
      baseUser.cours = user.cours || [];
      baseUser.qcm = user.qcm || [];
    }

    if (user.role === 'parent') {
      baseUser.parentKey = user.parentKey || null;
      baseUser.codeParent = user.codeParent || '';
      baseUser.eleveRelations = user.eleveRelations || [];
    }

    res.json(baseUser);

  } catch (err) {
    console.error('Erreur getCurrentUser :', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
