// ==============================
// 📦 Import des modules
// ==============================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// ==============================
// ⚙️ Création de l'application Express
// ==============================
const app = express();
const PORT = 3000;

// ==============================
// ✅ Middleware CORS (Angular + tests mobiles)
// ==============================
app.use(cors({
  origin: ['http://localhost:4200'], // autorise Angular
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user'],
  credentials: true
}));

// ==============================
// 🧱 Middlewares globaux
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// 📁 Création du dossier uploads et sous-dossier profils si inexistant
// ==============================
const uploadDir = path.join(__dirname, 'uploads');
const profilsDir = path.join(uploadDir, 'profils');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(profilsDir)) {
  fs.mkdirSync(profilsDir, { recursive: true });
}

// Exposer le dossier uploads pour Angular
app.use('/uploads', express.static(uploadDir));

// ==============================
// 🖼️ Configuration de multer (upload fichiers)
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilsDir); // tous les fichiers vont dans uploads/profils
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// ==============================
// 🌍 Connexion à MongoDB
// ==============================
// 🌍 Connexion à MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/dysone';

mongoose
  .connect(MONGO_URL)
  .then(() => console.log(`✅ Connexion à MongoDB réussie sur ${MONGO_URL}`))
  .catch(err => console.error('❌ Erreur MongoDB :', err));


// ==============================
// 📌 Import des routes
// ==============================
const userRoutes = require('./Backend/Routes/User.Routes');
const authRoutes = require('./Backend/Routes/User.Routes'); // vérifier si voulu
// const utilisateurRoutes = require('./backend/routes/utilisateur.Routes');
// const coursRoutes = require('./backend/routes/cours.Routes');
// const coursHtmlRoute = require('./backend/routes/cours-html.route');

// ==============================
// 🧭 Déclaration des routes API
// ==============================
app.use('/api/user', userRoutes);
app.use('/api/dysone', authRoutes);
// app.use('/api/utilisateurs', utilisateurRoutes);
// app.use('/api/cours', coursRoutes);
// app.use('/api/cours/html', coursHtmlRoute);

// ==============================
// 🏠 Routes de test
// ==============================
app.get('/', (req, res) => res.send('✅ Serveur UniDys opérationnel !'));
app.get('/api', (req, res) => res.json({ message: 'Bienvenue sur l’API ASDAM !' }));

// ==============================
// 🚀 Lancement du serveur
// ==============================
const IP_LOCALE = '192.168.1.43'; // 🟢 à remplacer par ton IP locale

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur backend démarré sur http://${IP_LOCALE}:${PORT}`);
  console.log(`📡 Accessible depuis ton téléphone via http://${IP_LOCALE}:${PORT}`);
});
