const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Utilisateur = require('../schema/user');

passport.use(new GoogleStrategy({
  clientID: 'TON_CLIENT_ID',
  clientSecret: 'TON_SECRET',
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  const existingUser = await Utilisateur.findOne({ googleId: profile.id });
  if (existingUser) return done(null, existingUser);

  const newUser = new Utilisateur({
    googleId: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    image: profile.photos[0].value
  });
  await newUser.save();
  return done(null, newUser);
}));
