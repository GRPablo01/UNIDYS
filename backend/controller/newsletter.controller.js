const Newsletter = require('../../schema/newletter'); // <-- CORRECT

exports.ajouterEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email invalide' });
  }

  try {
    const existant = await Newsletter.findOne({ email });

    if (existant) {
      return res.status(409).json({ message: 'Déjà inscrit à la newsletter' });
    }

    const nouvelEmail = new Newsletter({ email });
    await nouvelEmail.save();

    res.status(201).json({ message: 'Inscription réussie à la newsletter' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.verifierEmail = async (req, res) => {
  const email = req.query.email;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email invalide' });
  }

  try {
    const inscrit = await Newsletter.findOne({ email });
    res.status(200).json({ inscrit: !!inscrit });
  } catch (error) {
    console.error('Erreur lors de la vérification :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
