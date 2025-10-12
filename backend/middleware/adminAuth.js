const jwt = require('jsonwebtoken');
const User = require('../../schema/user');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : non-admin' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
