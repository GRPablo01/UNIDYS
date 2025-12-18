// ==================================================
// 📦 controllers/authController.js
// ==================================================

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// ==============================
// 📄 Import des schémas Mongoose
// ==============================
const { UserSchema } = require('../../Backend/Schéma/UserSchema');
const { EleveSchema } = require('../../Backend/Schéma/EleveSchema');
const { ProfSchema } = require('../../Backend/Schéma/ProfSchema');
const { ParentSchema } = require('../../Backend/Schéma/ParentSchema');

// ==============================
// 📁 Création des modèles à partir des schémas
// ==============================
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Eleve = mongoose.models.Eleve || mongoose.model('Eleve', EleveSchema);
const Prof = mongoose.models.Prof || mongoose.model('Prof', ProfSchema);
const Parent = mongoose.models.Parent || mongoose.model('Parent', ParentSchema);

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

    // ⚡ Création du token JWT (optionnel)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // ==============================
    // 🎯 Construction de l'objet utilisateur
    // ==============================
    const baseUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      initiale: user.initiale || `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
      avatar: user.avatar || user.photoProfil || '',
      Key: user.Key || '',
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? false,
      cguValide: user.cguValide ?? false,
      isActive: user.isActive ?? true,
    };

    // 🔹 Données spécifiques selon le rôle
    if (user.role === 'eleve') {
      const eleveData = await Eleve.findOne({ userId: user._id });
      baseUser.eleveKey = eleveData?.Key || user.Key || '';
      baseUser.codeProf = eleveData?.codeProf || '';
      baseUser.dysListe = eleveData?.dysListe || [];
      baseUser.eleveRelations = eleveData?.eleveRelations || [];
      baseUser.xp = eleveData?.xp || 0;
      baseUser.cours = eleveData?.cours || [];
      baseUser.qcm = eleveData?.qcm || [];
      baseUser.suivi = eleveData?.suivi || [];
      baseUser.abonnement = eleveData?.abonnement || [];
    }

    if (user.role === 'prof') {
      const profData = await Prof.findOne({ userId: user._id });
      baseUser.profKey = profData?.Key || user.Key || '';
      baseUser.codeProf = profData?.codeProf || '';
      baseUser.cours = profData?.coursCrees || [];
      baseUser.qcm = profData?.qcmCrees || [];
      baseUser.suivi = profData?.suivi || [];
      baseUser.abonnement = profData?.abonnement || [];
    }

    if (user.role === 'parent') {
      const parentData = await Parent.findOne({ userId: user._id });
      baseUser.parentKey = parentData?.Key || user.Key || '';
      baseUser.codeParent = parentData?.codeParent || '';
      baseUser.eleveRelations = parentData?.enfants || [];
      baseUser.suivi = parentData?.suivi || [];
      baseUser.abonnement = parentData?.abonnement || [];
    }

    // ⚡ Retour de l'utilisateur complet + token
    return res.status(200).json({ user: baseUser, token });

  } catch (error) {
    console.error('Erreur login :', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 🛡️ Middleware authenticate via Key
// ==============================
exports.authenticate = async (req, res, next) => {
  try {
    const key = req.headers['x-user-key'];
    if (!key) return res.status(401).json({ message: 'Key manquante' });

    const user = await User.findOne({ Key: key });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé pour cette Key' });

    req.userId = user._id;
    req.user = user;
    next();
  } catch (err) {
    console.error('Erreur authenticate via Key :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ==============================
// 👤 Récupérer l'utilisateur connecté
// ==============================
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Utilisateur non connecté' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const baseUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      initiale: user.initiale || `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
      avatar: user.avatar || user.photoProfil || '',
      Key: user.Key || '',
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 50,
      cookie: user.cookie ?? false,
      cguValide: user.cguValide ?? false,
      isActive: user.isActive ?? true,
    };

    if (user.role === 'eleve') {
      const eleveData = await Eleve.findOne({ userId: user._id });
      baseUser.eleveKey = eleveData?.Key || user.Key || '';
      baseUser.codeProf = eleveData?.codeProf || '';
      baseUser.dysListe = eleveData?.dysListe || [];
      baseUser.eleveRelations = eleveData?.eleveRelations || [];
      baseUser.xp = eleveData?.xp || 0;
      baseUser.cours = eleveData?.cours || [];
      baseUser.qcm = eleveData?.qcm || [];
      baseUser.suivi = eleveData?.suivi || [];
      baseUser.abonnement = eleveData?.abonnement || [];
    }

    if (user.role === 'prof') {
      const profData = await Prof.findOne({ userId: user._id });
      baseUser.profKey = profData?.Key || user.Key || '';
      baseUser.codeProf = profData?.codeProf || '';
      baseUser.cours = profData?.coursCrees || [];
      baseUser.qcm = profData?.qcmCrees || [];
      baseUser.suivi = profData?.suivi || [];
      baseUser.abonnement = profData?.abonnement || [];
    }

    if (user.role === 'parent') {
      const parentData = await Parent.findOne({ userId: user._id });
      baseUser.parentKey = parentData?.Key || user.Key || '';
      baseUser.codeParent = parentData?.codeParent || '';
      baseUser.eleveRelations = parentData?.enfants || [];
      baseUser.suivi = parentData?.suivi || [];
      baseUser.abonnement = parentData?.abonnement || [];
    }

    return res.json(baseUser);

  } catch (err) {
    console.error('Erreur getCurrentUser :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
