const User = require('../../schema/user');
const Cours = require('../../schema/cours');

// -------------------- INSCRIPTION --------------------
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà inscrit' });

    const user = new User({ nom, prenom, email, password, role, codeProf });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- RÉCUPÉRER UN UTILISATEUR --------------------
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- SUPPRIMER UN UTILISATEUR --------------------
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- AJOUTER XP --------------------
exports.addXP = async (req, res) => {
  try {
    const { xp } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.xp = (user.xp || 0) + xp;
    await user.save();
    res.json({ message: 'XP ajouté', updatedXP: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- RÉCUPÉRER TOUS LES UTILISATEURS --------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- MODIFIER UN UTILISATEUR --------------------
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Récupérer l'utilisateur existant
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const ancienNom = user.nom;
    const ancienPrenom = user.prenom;

    // Mettre à jour les champs
    user.nom = updates.nom ?? user.nom;
    user.prenom = updates.prenom ?? user.prenom;
    user.email = updates.email ?? user.email;
    user.role = updates.role ?? user.role;
    user.codeProf = updates.codeProf ?? user.codeProf;
    await user.save();

    // 🔄 Mettre à jour tous les cours si le nom/prénom a changé
    if (updates.nom || updates.prenom) {
      const nouveauNomProf = `${user.prenom} ${user.nom}`.trim();
      await Cours.updateMany(
        { utilisateurId: user._id },
        { $set: { nomProf: nouveauNomProf } }
      );
    }

    res.json(user);
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
  }
};

// -------------------- CHANGER LE MOT DE PASSE --------------------
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // ⚠️ Pour prod : hasher les mots de passe avec bcrypt
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la modification du mot de passe' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Si le prénom ou nom change, mettre à jour le nomProf dans les cours
    if (updates.firstName || updates.lastName) {
      const nomProfComplet = `${updatedUser.firstName} ${updatedUser.lastName}`.trim();
      await Cours.updateMany(
        { utilisateurId: id },
        { $set: { nomProf: nomProfComplet } }
      );
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
  }
};