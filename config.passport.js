// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Utilisateur = require('../models/Utilisateur'); // Ton modèle mongoose

passport.use(new GoogleStrategy({
    clientID: 'TON_CLIENT_ID',
    clientSecret: 'TON_CLIENT_SECRET',
    callbackURL: '/api/unidys/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const utilisateurExistant = await Utilisateur.findOne({ googleId: profile.id });

      if (utilisateurExistant) {
        return done(null, utilisateurExistant);
      }

      const nouvelUtilisateur = new Utilisateur({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
        role: 'eleve', // ou 'prof' selon ton contexte
      });

      await nouvelUtilisateur.save();
      done(null, nouvelUtilisateur);
    } catch (err) {
      done(err, null);
    }
  }
));
