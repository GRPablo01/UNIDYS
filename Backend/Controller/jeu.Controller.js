const JeuBase = require('../Schema/Jeux/JeuBase');

// ⚠️ IMPORTANT : charger les discriminators
require('../Schema/Jeux/PuzzleJeu');
require('../Schema/Jeux/MemoryJeu');
require('../Schema/Jeux/QcmJeu');
require('../Schema/Jeux/TexteJeu');

// 🎨 couleur par défaut globale
const DEFAULT_COLOR = '#B9FBC0';

// =====================================================
// 🎯 CREATE JEU
// =====================================================
exports.createJeu = async (req, res) => {
  try {
    const data = req.body;

    let jeu;

    // =====================================================
    // ❓ QCM
    // =====================================================
    if (data.type === 'qcm') {
      jeu = await JeuBase.create({
        type: 'qcm',

        // commun
        titre: data.titre,
        niveau: data.niveau,
        difficulte: data.difficulte,
        consigne: data.consigne,
        prof: data.prof,
        couleur: data.couleur || DEFAULT_COLOR,

        // spécifique
        question: data.question,
        options: data.options,
        reponse: data.reponse,
        indexReponse: data.indexReponse
      });
    }

    // =====================================================
    // 🧩 PUZZLE
    // =====================================================
    else if (data.type === 'puzzle') {
      jeu = await JeuBase.create({
        type: 'puzzle',

        titre: data.titre,
        niveau: data.niveau,
        difficulte: data.difficulte,
        consigne: data.consigne,
        prof: data.prof,
        couleur: data.couleur || '#CDB4DB',

        mot: data.mot,
        motTroue: data.motTroue,
        lettresManquantes: data.lettresManquantes,
        positionsCachees: data.positionsCachees
      });
    }

    // =====================================================
    // ✍️ PHRASE
    // =====================================================
    else if (data.type === 'phrasejeux') {

      // 🔥 on nettoie les mots (très important)
      const motsClean = (data.motsMelanges || []).map((mot) => {
        if (typeof mot === 'string') {
          return mot.trim();
        }
    
        if (mot.mot) {
          return String(mot.mot).trim();
        }
    
        return '';
      }).filter(m => m !== '');
    
      // 🔥 on mélange les mots
      const motsMelanges = motsClean
        .sort(() => Math.random() - 0.5)
        .map((mot, index) => ({
          mot,
          couleur: ['#A0C4FF', '#FFD6A5', '#FDFFB6', '#CDB4DB'][index % 4]
        }));
    
      jeu = await JeuBase.create({
        type: 'phrasejeux',
    
        titre: data.titre,
        niveau: data.niveau,
        difficulte: data.difficulte,
        consigne: data.consigne,
        prof: data.prof,
        couleur: data.couleur || '#A0C4FF',
    
        phraseOriginale: data.phraseOriginale.trim(),
    
        motsMelanges
      });
    }
    // =====================================================
    // 🧠 MEMORY
    // =====================================================
    else if (data.type === 'memory') {
      jeu = await JeuBase.create({
        type: 'memory',

        titre: data.titre,
        niveau: data.niveau,
        difficulte: data.difficulte,
        consigne: data.consigne,
        prof: data.prof,
        couleur: data.couleur || '#FFB3BA',

        // 🔥 couleur auto pour chaque carte si absente
        cartes: (data.cartes || []).map((carte, index) => ({
          ...carte,
          couleur: carte.couleur || ['#FFB3BA', '#B9FBC0', '#A0C4FF', '#FFD6A5'][index % 4]
        }))
      });
    }

    else {
      return res.status(400).json({
        message: 'Type de jeu invalide'
      });
    }

    res.status(201).json({
      message: 'Jeu créé avec succès',
      jeu
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur création jeu',
      error
    });
  }
};

// =====================================================
// 🎮 GET ALL JEUX
// =====================================================
exports.getAllJeux = async (req, res) => {
  try {
    const jeux = await JeuBase.find().sort({ createdAt: -1 });
    res.status(200).json(jeux);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur récupération jeux',
      error
    });
  }
};

// =====================================================
// 🎯 GET JEUX BY TYPE
// =====================================================
exports.getJeuxByType = async (req, res) => {
  try {
    const { type } = req.params;
    const jeux = await JeuBase.find({ type });

    res.status(200).json(jeux);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur récupération par type',
      error
    });
  }
};

// =====================================================
// 🔎 GET JEU BY ID
// =====================================================
exports.getJeuById = async (req, res) => {
  try {
    const jeu = await JeuBase.findById(req.params.id);

    if (!jeu) {
      return res.status(404).json({ message: 'Jeu introuvable' });
    }

    res.status(200).json(jeu);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur récupération jeu',
      error
    });
  }
};

// =====================================================
// ✏️ UPDATE JEU
// =====================================================
exports.updateJeu = async (req, res) => {
  try {
    const jeu = await JeuBase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!jeu) {
      return res.status(404).json({ message: 'Jeu introuvable' });
    }

    res.status(200).json({
      message: 'Jeu mis à jour',
      jeu
    });

  } catch (error) {
    res.status(500).json({
      message: 'Erreur update jeu',
      error
    });
  }
};

// =====================================================
// 🗑️ DELETE JEU
// =====================================================
exports.deleteJeu = async (req, res) => {
  try {
    const jeu = await JeuBase.findByIdAndDelete(req.params.id);

    if (!jeu) {
      return res.status(404).json({ message: 'Jeu introuvable' });
    }

    res.status(200).json({
      message: 'Jeu supprimé'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Erreur suppression jeu',
      error
    });
  }
};