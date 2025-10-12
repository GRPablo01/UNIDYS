const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/unidys', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/utilisateurs', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'Utilisateur créé' });
  } catch (error) {
    res.status(500).send({ error: 'Erreur serveur' });
  }
});

app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000'));
