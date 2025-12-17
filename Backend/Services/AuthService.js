const User = require('../src/Schema/user');
const bcrypt = require('bcrypt');

exports.login = async (email, password) => {
  // 1️⃣ Cherche l'utilisateur
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email ou mot de passe incorrect');

  // 2️⃣ Vérifie le mot de passe
  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) throw new Error('Email ou mot de passe incorrect');

  // 3️⃣ Crée une version nettoyée de l'utilisateur
  const userToSend = {
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    initiale: `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`,
  
    // ✅ Champs supplémentaires
    photoProfil: user.photoProfil || null,
    token: user.eleveKey || null,   // si tu veux garder un token
    theme: user.theme || 'sombre',
    font: user.font || 'Roboto',
    luminosite: user.luminosite ?? 100,
    cguValide: user.cguValide ?? false,
    dysListe: user.dysListe || [],
    eleveKey: user.eleveKey || '',
    xp: user.xp ?? 0,
    cours: user.cours || [],
    qcm: user.qcm || [],
    eleveRelations: user.eleveRelations || [],
    cookie: user.cookie ?? ' '
  };
  
  return userToSend;
};
