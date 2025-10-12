const QcmResult = require('../../schema/qcm');

// Sauvegarder un résultat
exports.saveResult = async (req, res) => {
  try {
    const { userId, qcmId, score, reponses, xpGagne } = req.body;
    if (!userId || !qcmId) return res.status(400).json({ message: 'userId et qcmId requis' });

    const newResult = new QcmResult({ userId, qcmId, score, reponses, xpGagne });
    await newResult.save();
    res.status(201).json({ message: 'Résultat sauvegardé', result: newResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer résultat d’un user pour un cours
exports.getResultByUserAndCours = async (req, res) => {
  try {
    const { coursId, userId } = req.params;
    const result = await QcmResult.findOne({ userId, qcmId: coursId });
    if (!result) return res.status(404).json({ message: 'Aucun résultat trouvé' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tous les résultats d’un user
exports.getResultsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QcmResult.find({ userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
