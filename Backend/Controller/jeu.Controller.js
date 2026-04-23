const Jeu = require('../Schema/Jeux');

// =====================================================
// 🎮 CRÉATION JEU (STRUCTURE PROPRE + IA READY)
// =====================================================
exports.createJeu = async (req, res) => {
  try {

    // =====================================================
    // 🔵 CHAMPS COMMUNS (TOUS LES JEUX)
    // =====================================================
    const {
      titre,
      type,
      niveau,
      difficulte,
      consigne,
      prof
    } = req.body;

    // =====================================================
    // 🔧 NORMALISATION BASE
    // =====================================================
    const toArray = (val) =>
      typeof val === 'string'
        ? val.split(',').map(v => v.trim()).filter(Boolean)
        : Array.isArray(val)
          ? val
          : [];

    // =====================================================
    // 🎮 CHAMPS BRUTS
    // =====================================================
    const {
      mots,
      question,
      options,
      reponse,
      mot,
      lettresManquantes,
      phrase,
      trou,
      cartes
    } = req.body;

    const motsArray = toArray(mots);
    const optionsArray = toArray(options);

    let lettresArray = toArray(lettresManquantes);

    let cartesArray = [];
    try {
      cartesArray =
        typeof cartes === 'string'
          ? JSON.parse(cartes)
          : Array.isArray(cartes)
            ? cartes
            : [];
    } catch {
      cartesArray = [];
    }

    // =====================================================
    // 🧠 CHAMPS SPÉCIFIQUES PAR TYPE
    // =====================================================
    let contenuGenere = {};
    let specificData = {};

    switch (type) {

      // 🔵 QCM
      case 'qcm':
        specificData = {
          question,
          options: optionsArray,
          reponse
        };

        contenuGenere = {
          question: question || "Question générée automatiquement",
          options: optionsArray.length ? optionsArray : ["A", "B", "C"],
          reponse: reponse || optionsArray[0] || "A",
          explication: "Bonne réponse expliquée automatiquement"
        };
        break;

      // 🟡 PUZZLE
      case 'puzzle':
        specificData = {
          mot,
          lettresManquantes: lettresArray
        };

        contenuGenere = {
          mot: mot || "C_T",
          lettresManquantes: lettresArray.length ? lettresArray : ["A"],
          indice: "Indice généré automatiquement"
        };
        break;

      // 🟢 TEXTE À TROUS
      case 'texte':
        specificData = {
          phrase,
          trou,
          mots: motsArray
        };

        contenuGenere = {
          phrase: phrase || "Le chat mange une ___",
          trou: trou || "pomme",
          motsPossibles: motsArray.length ? motsArray : ["pomme", "banane", "pain"]
        };
        break;

      // 🔴 MEMORY
      case 'memory':
        specificData = {
          cartes: cartesArray
        };

        contenuGenere = {
          cartes: cartesArray.length
            ? cartesArray
            : [
                { id: 1, valeur: "A" },
                { id: 2, valeur: "Avion" }
              ]
        };
        break;

      // 🧠 DEFAULT
      default:
        specificData = {
          mots: motsArray
        };

        contenuGenere = {
          message: "Jeu généré automatiquement",
          data: motsArray
        };
        break;
    }

    // =====================================================
    // 💾 OBJET FINAL PROPRE
    // =====================================================
    const jeu = new Jeu({
      // 🔵 COMMUNS
      titre,
      type,
      niveau,
      difficulte,
      consigne,
      prof,

      // 🎮 SPÉCIFIQUES
      ...specificData,

      // 🧠 IA / RÉSULTAT
      contenuGenere
    });

    await jeu.save();

    res.status(201).json({
      message: "Jeu créé avec succès",
      jeu
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================================
// 📚 RÉCUPÉRER LES JEUX D'UN PROF
// =====================================================
exports.getJeuxByProf = async (req, res) => {
  try {
    const jeux = await Jeu.find({ prof: req.params.prof })
      .sort({ createdAt: -1 });

    res.json(jeux);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================================
// 🎯 RÉCUPÉRER UN JEU PAR ID
// =====================================================
exports.getJeuById = async (req, res) => {
  try {
    const jeu = await Jeu.findById(req.params.id);

    if (!jeu) {
      return res.status(404).json({ message: "Jeu introuvable" });
    }

    res.json(jeu);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================================
// 🗑️ SUPPRIMER UN JEU
// =====================================================
exports.deleteJeu = async (req, res) => {
  try {
    const jeu = await Jeu.findByIdAndDelete(req.params.id);

    if (!jeu) {
      return res.status(404).json({ message: "Jeu introuvable" });
    }

    res.json({ message: "Jeu supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};