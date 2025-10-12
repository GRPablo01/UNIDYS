// services/authService.js
const User = require('../../schema/user');
const bcrypt = require('bcrypt');

exports.login = async (email, password) => {
  // 1. Cherche l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // 2. Vérifie le mot de passe
  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // 3. Crée une version nettoyée de l'utilisateur
  const userToSend = {
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    initiale: `${(user.prenom?.[0] || '').toUpperCase()}${(user.nom?.[0] || '').toUpperCase()}`
  };

  return userToSend;
};
