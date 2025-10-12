const Cours = require('../../schema/cours');
const User = require('../../schema/user');
const path = require('path');
const fs = require('fs');

exports.creerCours = async (req, res) => {
  try {
    const { titre, niveau, matiere, nomProf, lienYoutube, utilisateurId } = req.body;
    const fichier = req.file;

    if (!titre || !niveau || !matiere || !fichier || !utilisateurId) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const user = await User.findById(utilisateurId);
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

    let qcms = [];
    if (req.body.qcms) {
      try {
        qcms = JSON.parse(req.body.qcms);
        if (!Array.isArray(qcms)) qcms = [];
      } catch {
        return res.status(400).json({ message: 'Format QCM invalide.' });
      }
    }

    // ← Récupération des types DYS
    let dysTypes = [];
    if (req.body.dysTypes) {
      try {
        dysTypes = JSON.parse(req.body.dysTypes);
        if (!Array.isArray(dysTypes)) dysTypes = [];
      } catch {
        return res.status(400).json({ message: 'Format DYS invalide.' });
      }
    }

    const nouveauCours = new Cours({
      titre,
      niveau,
      matiere,
      nomProf: `${user.prenom} ${user.nom}`.trim(),
      lienYoutube: lienYoutube || '',
      fichierPdf: fichier.filename,
      utilisateurId,
      qcms,
      dysTypes, // ← ajout ici
    });

    await nouveauCours.save();

    res.status(201).json({
      message: 'Cours créé',
      data: { ...nouveauCours.toObject(), pdfUrl: `/uploads/${fichier.filename}` }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.modifierCours = async (req, res) => {
  try {
    const id = req.params.id;
    const cours = await Cours.findById(id);
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });

    if (req.body.titre !== undefined) {
      cours.titre = req.body.titre;
    }

    if (req.body.lienYoutube !== undefined) {
      cours.lienYoutube = req.body.lienYoutube;
    }

    if (req.file) {
      // Suppression ancienne PDF si besoin (optionnel)
      const ancienFichier = cours.fichierPdf;
      if (ancienFichier) {
        const cheminAncienFichier = path.join(__dirname, '../../uploads', ancienFichier);
        if (fs.existsSync(cheminAncienFichier)) {
          fs.unlinkSync(cheminAncienFichier);
        }
      }
      cours.fichierPdf = req.file.filename;
    }

    await cours.save();

    res.json({ message: 'Cours modifié avec succès.', cours });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Récupérer tous les cours (corrigé)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Cours.find(); // <-- utiliser le modèle Cours
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// ✅ Modifier un cours par ID
exports.updateCours = async (req, res) => {
  try {
    const { id } = req.params;  // Récupère l'ID passé dans l'URL
    const updates = req.body;   // Récupère les champs envoyés par Angular

    const updatedCours = await Cours.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCours) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    res.json(updatedCours);
  } catch (err) {
    console.error("❌ Erreur updateCours:", err);
    res.status(500).json({ message: "Erreur lors de la modification du cours" });
  }
};



// Autres méthodes : listerCoursParProf, supprimerCours, modifierPdfCours ...

exports.creerCours = async (req, res) => { /* ... */ }
exports.listerCoursParProf = async (req, res) => { /* ... */ }
exports.supprimerCours = async (req, res) => { /* ... */ }
exports.modifierPdfCours = async (req, res) => { /* ... */ }
