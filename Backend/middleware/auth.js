const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // récupère "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, 'TA_CLE_SECRETE'); // remplace par ta clé secrète
    req.user = decoded; // met l'user dans req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};