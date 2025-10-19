require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./schema/user'); // adapte le chemin vers ton modèle

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unidys', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connecté à MongoDB');

    // Demander les infos
    rl.question('Nom: ', (nom) => { 
      rl.question('Prénom: ', (prenom) => { 
        rl.question('Email: ', (email) => {
          rl.question('Mot de passe: ', async (password) => {
            
            // Vérifier si un admin existe déjà
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) {
              console.log('❌ Un admin existe déjà. Script annulé.');
              process.exit();
            }

            // Créer l'admin
            const admin = new User({
              nom,
              prenom,
              email,
              password,
              role: 'admin'
            });

            await admin.save();
            console.log('✅ Admin créé avec succès !');
            process.exit();
          });
        });
      });
    });

  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
})();
