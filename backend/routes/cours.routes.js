const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const Cours = require('../../schema/cours');
const User = require('../../schema/user');

const coursController = require('../controller/cours.controller');

router.get('/unidys/courses', coursController.getAllCourses);
router.post('/unidys/courses', coursController.creerCours);
router.put('/unidys/courses/:id', coursController.modifierCours);

// Assure-toi que le dossier uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configuration Multer pour stocker les PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// --- CREATE cours (POST) ---
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { titre, niveau, matiere, lienYoutube, utilisateurId, qcms, dysTypes } = req.body;
    const fichier = req.file;

    if (!titre || !niveau || !matiere || !fichier || !utilisateurId) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const user = await User.findById(utilisateurId);
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

    // Parse QCM et dysTypes en JSON
    let qcmsParsed = [];
    if (qcms) {
      try {
        qcmsParsed = JSON.parse(qcms);
        if (!Array.isArray(qcmsParsed)) qcmsParsed = [];
      } catch {
        return res.status(400).json({ message: 'Format QCM invalide.' });
      }
    }

    let dysTypesParsed = [];
    if (dysTypes) {
      try {
        dysTypesParsed = JSON.parse(dysTypes);
        if (!Array.isArray(dysTypesParsed)) dysTypesParsed = [];
      } catch {
        return res.status(400).json({ message: 'Format dysTypes invalide.' });
      }
    }

    const xpTotal = qcmsParsed.reduce((total, qcm) => total + (qcm.xp || 0), 0);
    const nomProfComplet = `${user.prenom} ${user.nom}`.trim();

    const nouveauCours = new Cours({
      titre,
      niveau,
      matiere,
      nomProf: nomProfComplet,
      lienYoutube: lienYoutube || '',
      fichierPdf: fichier.filename,
      utilisateurId,
      qcms: qcmsParsed,
      dysTypes: dysTypesParsed,
      xpTotal
    });

    await nouveauCours.save();

    res.status(201).json({
      message: 'Cours créé',
      data: { ...nouveauCours.toObject(), pdfUrl: `/uploads/${fichier.filename}` }
    });

  } catch (err) {
    console.error('Erreur création cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du cours.', error: err.message });
  }
});

// --- GET cours par nomProf ---
router.get('/prof/:nomProf', async (req, res) => {
  try {
    const { nomProf } = req.params;
    const regex = new RegExp(`^${nomProf}$`, 'i');

    const coursProf = await Cours.find({ nomProf: regex });

    const coursAvecPdfUrl = coursProf.map(c => {
      const obj = c.toObject();
      obj.pdfUrl = c.fichierPdf ? `/uploads/${c.fichierPdf}` : null;
      return obj;
    });

    res.json(coursAvecPdfUrl);
  } catch (err) {
    console.error('Erreur récupération cours par nomProf:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des cours', error: err.message });
  }
});

// --- PUT modifier cours ---
router.put('/:id', upload.single('fichierPdf'), async (req, res) => {
  try {
    const { titre, qcms, dysTypes } = req.body;
    const nouveauFichier = req.file;

    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });

    if (titre) cours.titre = titre;

    if (qcms) {
      let qcmsParsed = [];
      try {
        qcmsParsed = JSON.parse(qcms);
        if (!Array.isArray(qcmsParsed)) qcmsParsed = [];
      } catch {
        return res.status(400).json({ message: 'Format QCM invalide.' });
      }
      cours.qcms = qcmsParsed;
      cours.xpTotal = qcmsParsed.reduce((total, qcm) => total + (qcm.xp || 0), 0);
    }

    if (dysTypes) {
      let dysTypesParsed = [];
      try {
        dysTypesParsed = JSON.parse(dysTypes);
        if (!Array.isArray(dysTypesParsed)) dysTypesParsed = [];
      } catch {
        return res.status(400).json({ message: 'Format dysTypes invalide.' });
      }
      cours.dysTypes = dysTypesParsed;
    }

    if (nouveauFichier) {
      if (cours.fichierPdf) {
        const ancienPath = path.join(uploadDir, cours.fichierPdf);
        if (fs.existsSync(ancienPath)) fs.unlinkSync(ancienPath);
      }
      cours.fichierPdf = nouveauFichier.filename;
    }

    await cours.save();

    res.json({
      message: 'Cours modifié avec succès.',
      cours: { ...cours.toObject(), pdfUrl: cours.fichierPdf ? `/uploads/${cours.fichierPdf}` : null }
    });

  } catch (err) {
    console.error('Erreur modification cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la modification du cours.', error: err.message });
  }
});

// --- DELETE cours ---
router.delete('/:id', async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });

    if (cours.fichierPdf) {
      const pdfPath = path.join(uploadDir, cours.fichierPdf);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await cours.deleteOne();
    res.json({ message: 'Cours supprimé.' });

  } catch (err) {
    console.error('Erreur suppression cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du cours.', error: err.message });
  }
});

// --- Récupérer le cours complet par ID ---
router.get('/complet/:id', async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // --- Lecture du PDF et conversion en HTML ---
    const pdfPath = path.join(uploadDir, cours.fichierPdf || '');
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'Fichier PDF non trouvé' });
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);

    const htmlSimple = data.text
      .split('\n')
      .map(line => `<p>${line.trim()}</p>`)
      .join('');

    // --- Renvoyer toutes les infos pour Angular ---
    res.json({
      html: htmlSimple,                   // contenu du PDF converti en HTML
      qcm: cours.qcms || [],              // QCM associés
      coursInfo: {                        // infos générales du cours
        titre: cours.titre || 'Titre non défini',
        niveau: cours.niveau || 'Niveau non défini',
        matiere: cours.matiere || 'Matière non définie'
      },
      dysTypes: cours.dysTypes || []      // types DYS concernés
    });

  } catch (err) {
    console.error('Erreur récupération cours complet:', err);
    res.status(500).json({
      message: 'Erreur serveur lors de la récupération du cours complet',
      error: err.message
    });
  }
});

// --- GET tous les cours ---
router.get('/', async (req, res) => {
  try {
    const cours = await Cours.find();
    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPDATE nomProf quand un user change son nom/prenom ---
router.put('/updateByProf/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const nouveauNomProf = `${user.prenom} ${user.nom}`.trim();

    // Mettre à jour tous les cours de ce prof
    const result = await Cours.updateMany(
      { utilisateurId: userId },
      { $set: { nomProf: nouveauNomProf } }
    );

    res.json({ success: true, nouveauNomProf, result });
  } catch (err) {
    console.error('Erreur update nomProf:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des cours' });
  }
});

module.exports = router;
