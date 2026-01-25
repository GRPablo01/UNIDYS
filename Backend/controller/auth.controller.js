// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../Backend/Schema/User');

const JWT_SECRET = process.env.JWT_SECRET || 'UNIDYS_SECRET';

// ==============================
// 🔑 LOGIN
// ==============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  try {
    // 🔹 Récupérer l'utilisateur par email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // 🔹 Vérification mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // 🔹 Vérification du statut du compte
    const compteStatus = user.status?.compte?.toLowerCase() || 'actif';
    if (compteStatus === 'desactive') {
      return res.status(403).json({ message: 'Compte désactivé', reason: 'desactive' });
    }
    if (compteStatus === 'supprime') {
      return res.status(403).json({ message: 'Compte supprimé', reason: 'supprime' });
    }

    // 🔹 Création du JWT (7 jours)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // 🔹 Construction de l'objet utilisateur à renvoyer (sans mot de passe)
    const baseUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      key: user.key || null,
      code: user.code || '',
      initiale: user.initiale || `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
      photoProfil: user.photoProfil || '',
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      cguValide: user.cguValide ?? false,
      status: compteStatus,
    };

    // 🔹 Données supplémentaires selon le rôle
    if (user.role === 'eleve') {
      baseUser.dysListe = user.dysListe || [];
      baseUser.eleveRelations = user.eleveRelations || [];
      baseUser.xp = user.xp || 0;
    }
    if (user.role === 'prof') {
      baseUser.cours = user.cours || [];
      baseUser.qcm = user.qcm || [];
    }
    if (user.role === 'parent') {
      baseUser.eleveRelations = user.eleveRelations || [];
    }

    return res.status(200).json({ user: baseUser, token });
  } catch (error) {
    console.error('[Login] Erreur serveur :', error.message);
    return res.status(500).json({ message: 'Erreur serveur' });
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
// 👤 Récupérer utilisateur connecté
// ==============================
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const compteStatus = user.status?.compte?.toLowerCase() || 'actif';
    if (compteStatus !== 'actif') {
      return res.status(403).json({
        message: compteStatus === 'desactive' ? 'Compte désactivé' : 'Compte supprimé',
        reason: compteStatus,
      });
    }

    const baseUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      key: user.key || null,
      code: user.code || '',
      initiale: user.initiale || `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
      photoProfil: user.photoProfil || '',
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? '',
      cguValide: user.cguValide ?? false,
      status: compteStatus,
    };

    if (user.role === 'eleve') {
      baseUser.dysListe = user.dysListe || [];
      baseUser.eleveRelations = user.eleveRelations || [];
      baseUser.xp = user.xp || 0;
    }
    if (user.role === 'prof') {
      baseUser.cours = user.cours || [];
      baseUser.qcm = user.qcm || [];
    }
    if (user.role === 'parent') {
      baseUser.eleveRelations = user.eleveRelations || [];
    }

    return res.json(baseUser);
  } catch (err) {
    console.error('[getCurrentUser] Erreur serveur :', err.message);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
