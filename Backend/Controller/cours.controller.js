const Cours = require('../Schema/Cours');

// ==============================
// 🔑 Génération de clé unique
// ==============================
function randomSuffix(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateKey() {
  const numberPart = Math.floor(Math.random() * 100000);
  const suffix = randomSuffix(5);
  return `${numberPart}${suffix}`;
}

// ==============================
// 📚 CRÉER UN COURS
// ==============================
exports.creerCours = async (req, res) => {
  try {
    const {
      titre,
      description,
      nom,
      prenom,

      // 🎓 scolaires
      matiere,
      niveauScolaire,

      // 🧠 info pédagogiques
      niveau,
      duree,
      categorie,

      // 🎨 visuel
      couleur,

      // 🎥 vidéo
      videoUrl
    } = req.body;

    // 📄 PDF obligatoire
    if (!req.file) {
      return res.status(400).json({ message: "PDF requis" });
    }

    const pdfUrl = req.file.path;

    // 🔑 clé unique
    const key = generateKey();

    // 🎥 vidéo optionnelle
    const video = videoUrl?.trim()
      ? { url: videoUrl.trim() }
      : undefined;

    // 📦 création cours
    const nouveauCours = new Cours({
      titre,
      description,

      nom,
      prenom,

      pdfUrl,

      key,

      // 🎓 scolaire (IMPORTANT)
      matiere: matiere || 'francais',
      niveauScolaire,

      // 🧠 pédagogique
      niveau: niveau || 'debutant',
      duree: duree ? Number(duree) : null,
      categorie: categorie || '',


      // 🎨 design
      couleur: couleur || '#6366f1',

      // 🎥 vidéo
      video,
    });

    await nouveauCours.save();

    res.status(201).json({
      message: "Cours créé avec succès",
      cours: nouveauCours
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// ==============================
// 📖 LISTE DES COURS
// ==============================
exports.listerCours = async (req, res) => {
  try {
    const {
      categorie,
      niveau,
      matiere,
      niveauScolaire,
      search
    } = req.query;

    const filtre = { publie: true };

    if (categorie) filtre.categorie = categorie;
    if (niveau) filtre.niveau = niveau;
    if (matiere) filtre.matiere = matiere;
    if (niveauScolaire) filtre.niveauScolaire = niveauScolaire;

    // 🔍 recherche texte (si index ajouté dans mongoose)
    if (search) {
      filtre.$text = { $search: search };
    }

    const cours = await Cours.find(filtre)
      .sort({ dateCreation: -1 });

    res.status(200).json(cours);

  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// ==============================
// 🔍 DÉTAIL D'UN COURS
// ==============================
exports.getCours = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);

    if (!cours) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    // 👁️ incrémentation vues
    cours.vues = (cours.vues || 0) + 1;
    await cours.save();

    res.status(200).json(cours);

  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};