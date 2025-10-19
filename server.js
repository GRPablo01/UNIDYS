const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes existantes
const authRoutes = require('./backend/routes/user.Routes');
const newsletterRoutes = require('./backend/routes/newsletter.routes');
const avisRoutes = require('./backend/routes/avis.routes');
const coursRoutes = require('./backend/routes/cours.routes');
const coursHtmlRoute = require('./backend/routes/cours-html.route');
const userRoutes = require('./backend/routes/user.Routes');
const utilisateurRoutes = require('./backend/routes/utilisateur.Routes');
// Nouvelle route QCM
const qcmRoutes = require('./backend/routes/qcm.routes');
const qcmResultsRouter = require('./backend/routes/qcmresults.routes');

// route élèves
const eleveRoutes = require('./backend/routes/eleve.Routes'); // <-- ajouté

// route Admin
// const createAdminRoute = require('./createAdmin');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Routes
app.use('/api/unidys', authRoutes);
app.use('/api', userRoutes);
app.use('/api/user', utilisateurRoutes);
app.use('/api/unidys', newsletterRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/cours/html', coursHtmlRoute);

// route élèves
app.use('/api', eleveRoutes); // <-- ajouté ici
app.use('/api/unidys/cours', coursRoutes);
// Routes QCM (gestion des résultats)
app.use('/api/qcm', qcmRoutes);
app.use('/api/qcm/resultats', qcmResultsRouter);

// routes Admin
// app.use('/api/setup', createAdminRoute);

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 📁 Servir les fichiers PDF statiques depuis /uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // 🔌 Connexion MongoDB
// mongoose.connect('mongodb://localhost:27017/unidys', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('✅ Connecté à MongoDB unidys'))
//   .catch(err => console.error('❌ Erreur MongoDB:', err));

// // 🔹 IMPORT DES MODELS
// const User = require('./schema/user');
// const Newsletter = require('./schema/newletter');
// const Avis = require('./schema/avis');
// const Cours = require('./schema/cours');

// // 🔸 MULTER PDF Upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// // ========================
// // ✅ ROUTES API
// // ========================

// // --- Inscription utilisateur
// app.post('/api/unidys/users', async (req, res) => {
//   try {
//     const { nom, prenom, email, password, role, codeProf } = req.body;

//     if (!nom || !prenom || !email || !password) {
//       return res.status(400).json({ message: 'Nom, prénom, email et mot de passe sont obligatoires.' });
//     }

//     const exist = await User.findOne({ email });
//     if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

//     if (role === 'prof' && codeProf !== 'PROF2025') {
//       return res.status(400).json({ message: 'Code professeur invalide' });
//     }

//     if (role === 'admin') {
//       return res.status(403).json({ message: 'Création admin interdite via cette route' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const nouvelUtilisateur = new User({
//       nom,
//       prenom,
//       email,
//       password: hashedPassword,
//       role,
//       codeProf: role === 'prof' ? codeProf : undefined,
//     });

//     await nouvelUtilisateur.save();

//     const utilisateurSansMdp = await User.findById(nouvelUtilisateur._id).select('-password');

//     res.status(201).json(utilisateurSansMdp);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// // --- Connexion utilisateur
// app.post('/api/unidys/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const utilisateur = await User.findOne({ email });
//     if (!utilisateur) return res.status(401).json({ message: 'Utilisateur non trouvé' });

//     const passwordOk = await bcrypt.compare(password, utilisateur.password);
//     if (!passwordOk) return res.status(401).json({ message: 'Mot de passe incorrect' });

//     // On renvoie les infos sans le mot de passe
//     const { _id, nom, prenom, role, initiale } = utilisateur;

//     res.json({ _id, nom, prenom, email, role, initiale });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// // --- Inscription newsletter
// app.post('/api/newsletter', async (req, res) => {
//   try {
//     const { nom = '', prenom = '', email, accepteNewsletter = 'oui' } = req.body;
//     if (!email) return res.status(400).json({ message: 'Email requis' });

//     const saved = await Newsletter.findOneAndUpdate(
//       { email },
//       { nom, prenom, accepteNewsletter },
//       { upsert: true, new: true }
//     );

//     res.status(201).json({ message: 'Inscription newsletter enregistrée', data: saved });

//   } catch (err) {
//     console.error('Erreur newsletter :', err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// // --- Ajouter un avis
// app.post('/api/avis', async (req, res) => {
//   try {
//     const { nom, prenom, message } = req.body;
//     if (!nom || !prenom || !message) {
//       return res.status(400).json({ message: 'Tous les champs sont requis.' });
//     }

//     const nouvelAvis = new Avis({ nom, prenom, message });
//     const result = await nouvelAvis.save();

//     res.status(201).json({ message: 'Avis enregistré avec succès !', data: result });

//   } catch (err) {
//     console.error('Erreur enregistrement avis:', err);
//     res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement de l\'avis.' });
//   }
// });

// // --- Créer un cours (avec fichier PDF et QCM)
// app.post('/api/cours', upload.single('pdf'), async (req, res) => {
//   try {
//     const { titre, niveau, matiere, nomProf, lienYoutube } = req.body;
//     const fichier = req.file;

//     if (!titre || !niveau || !matiere || !fichier) {
//       return res.status(400).json({ message: 'Titre, niveau, matière et fichier PDF sont requis.' });
//     }

//     // Trouver utilisateurId du prof à partir du nomProf
//     let utilisateurId = null;
//     if (nomProf) {
//       const parts = nomProf.trim().split(' ');
//       if (parts.length >= 2) {
//         const prenom = parts.shift();
//         const nom = parts.join(' ');
//         const utilisateur = await User.findOne({
//           nom: new RegExp(`^${nom}$`, 'i'),
//           prenom: new RegExp(`^${prenom}$`, 'i'),
//           role: 'prof',
//         });
//         if (utilisateur) {
//           utilisateurId = utilisateur._id;
//         }
//       }
//     }
//     if (!utilisateurId) {
//       utilisateurId = new mongoose.Types.ObjectId(); // ID bidon si non trouvé
//     }

//     // Gestion des QCM
//     let qcms = [];
//     if (req.body.qcms) {
//       try {
//         qcms = JSON.parse(req.body.qcms);
//         if (!Array.isArray(qcms)) qcms = [];
//         else {
//           qcms = qcms.filter(q =>
//             q.question && Array.isArray(q.reponses) && typeof q.bonneReponse === 'number'
//           );
//         }
//       } catch {
//         return res.status(400).json({ message: 'Erreur de format des QCM.' });
//       }
//     }

//     const nouveauCours = new Cours({
//       titre,
//       niveau,
//       matiere,
//       nomProf: nomProf || '',
//       lienYoutube: lienYoutube || '',
//       fichierPdf: fichier.filename,
//       utilisateurId,
//       qcms,
//     });

//     await nouveauCours.save();

//     res.status(201).json({
//       message: 'Cours enregistré avec succès',
//       data: {
//         ...nouveauCours.toObject(),
//         pdf: `/uploads/${fichier.filename}`
//       }
//     });

//   } catch (err) {
//     console.error('Erreur cours:', err);
//     res.status(500).json({ message: 'Erreur serveur lors de la création du cours.' });
//   }
// });

// // Route pour récupérer les cours d’un prof
// app.get('/api/cours/prof/:nomProf', async (req, res) => {
//   try {
//     const { nomProf } = req.params;
//     const regex = new RegExp(`^${nomProf}$`, 'i');

//     const cours = await Cours.find({ nomProf: regex });

//     const coursAvecPdf = cours.map(c => {
//       const obj = c.toObject();
//       obj.pdf = c.fichierPdf ? `/uploads/${c.fichierPdf}` : null;
//       return obj;
//     });

//     res.json(coursAvecPdf);
//   } catch (err) {
//     console.error('Erreur récupération cours :', err);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });


// app.get('/api/cours/eleve/:nom', async (req, res) => {
//   const { nom } = req.params;
//   const { niveau } = req.query;

//   try {
//     const cours = await CoursModel.find({ elevesVus: nom, niveau });
//     res.json(cours);
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });


// // --- Modifier le fichier PDF d’un cours
// app.put('/api/cours/:id/fichier', upload.single('pdf'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'Fichier PDF requis' });
//     }

//     const cours = await Cours.findById(req.params.id);
//     if (!cours) return res.status(404).json({ error: 'Cours non trouvé' });

//     // Supprimer l'ancien fichier si existant
//     if (cours.fichierPdf) {
//       const ancienPath = path.join(__dirname, 'uploads', cours.fichierPdf);
//       if (fs.existsSync(ancienPath)) fs.unlinkSync(ancienPath);
//     }

//     cours.fichierPdf = req.file.filename;
//     await cours.save();

//     res.json({ message: 'Fichier PDF mis à jour', cours });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // --- Supprimer un cours
// app.delete('/api/cours/:id', async (req, res) => {
//   try {
//     const cours = await Cours.findById(req.params.id);
//     if (!cours) return res.status(404).json({ error: 'Cours non trouvé' });

//     // Supprimer fichier PDF associé
//     if (cours.fichierPdf) {
//       const pdfPath = path.join(__dirname, 'uploads', cours.fichierPdf);
//       if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
//     }

//     await cours.deleteOne();
//     res.json({ message: 'Cours supprimé' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ========================
// // ▶️ Démarrage du serveur
// // ========================
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
// });
