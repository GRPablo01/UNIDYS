// controllers/authController.js
const authService = require('../../src/services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.login(email, password);
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur login :', error.message);
    res.status(401).json({ message: error.message });
  }
};
