const User = require('../../schema/user'); // modèle User

// Récupérer tous les élèves
exports.getAllEleves = async (req, res) => {
  try {
    const eleves = await User.find({ role: 'eleve' }).sort({ xp: -1 }); // tri décroissant
    res.json(eleves);
  } catch (error) {
    console.error('Erreur récupération élèves :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer un élève par ID
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await User.findOne({ _id: req.params.id, role: 'eleve' });
    if (!eleve) return res.status(404).json({ message: 'Élève non trouvé' });
    res.json(eleve);
  } catch (error) {
    console.error('Erreur récupération élève :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
