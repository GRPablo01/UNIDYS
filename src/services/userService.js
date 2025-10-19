// services/userService.js
const User = require('../../schema/user');
const bcrypt = require('bcrypt');

exports.createUser = async (data) => {
  const { nom, prenom, email, password, role, codeProf, initiale } = data;

  // Validation simple
  if (!nom || !prenom || !email || !password || !role) {
    throw new Error('Champs requis manquants');
  }

  // Vérifie si l'email est déjà utilisé
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Si rôle professeur, vérifie le code
  if (role === 'prof' && codeProf !== 'PROF2025') {
    throw new Error('Code professeur invalide');
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    nom,
    prenom,
    email,
    password: hashedPassword,
    role,
    initiale: initiale || (prenom[0] + nom[0]).toUpperCase(),
  });

  await user.save();

  // Retourne l'utilisateur sans mot de passe
  return {
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    initiale: user.initiale,
  };
};
