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



