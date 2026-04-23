const jwt = require('jsonwebtoken');
const User = require('../../Backend/Schema/user');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'UNIDYS_SECRET';

// ================= LOGIN =================

exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(401).json({
        message: 'Utilisateur non trouvé'
      });

    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {

      return res.status(401).json({
        message: 'Mot de passe incorrect'
      });

    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }

};

// ================= AUTH =================

exports.authenticate = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {

    return res.status(401).json({
      message: 'Token manquant'
    });

  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {

    if (err) {

      return res.status(401).json({
        message: 'Token invalide'
      });

    }

    req.userId = decoded.id;

    next();

  });

};

// ================= CURRENT USER =================

exports.getCurrentUser = async (req, res) => {

  try {

    const user = await User
      .findById(req.userId)
      .select('-password');

    if (!user) {

      return res.status(404).json({
        message: 'Utilisateur non trouvé'
      });

    }

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: 'Erreur serveur'
    });

  }

};