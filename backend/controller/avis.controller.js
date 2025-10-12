const Avis = require('../../schema/avis');

// GET /api/avis
exports.getAvis = async (req, res) => {
  try {
    const avisList = await Avis.find().sort({ date: -1 }).limit(10); // dernier 10 avis
    res.json(avisList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors du chargement des avis' });
  }
};

// POST /api/avis
exports.postAvis = async (req, res) => {
  try {
    const { nom, prenom, message } = req.body;
    if (!nom || !prenom || !message) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    const nouvelAvis = new Avis({ nom, prenom, message });
    await nouvelAvis.save();
    res.status(201).json(nouvelAvis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'avis' });
  }
};
