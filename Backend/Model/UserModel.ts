// ==================================================
// 📄 models/user.interface.model.ts (Interface TypeScript pour User)
// ==================================================

// Interface TypeScript pour un utilisateur UniDys
export interface IUser {
    id?: string;             // Identifiant unique MongoDB (_id), optionnel car généré automatiquement
    nom: string;             // Nom de l'utilisateur
    prenom: string;          // Prénom de l'utilisateur
    email: string;           // Adresse email de connexion
    password: string;        // Mot de passe chiffré
    role: 'eleve' | 'prof' | 'parent';  // Rôle de l'utilisateur dans la plateforme
    initiales?: string;      // Initiales de l'utilisateur (optionnel, pour affichage UI)
    avatar?: string;         // URL ou chemin de l'image de profil (optionnel)
    cguValide?: boolean;     // Indique si les Conditions Générales d'Utilisation ont été acceptées
    isActive?: boolean;      // Statut du compte actif ou désactivé (optionnel, par défaut true)
    createdAt?: Date;        // Date de création du compte (optionnel, générée par la base)
    updatedAt?: Date;        // Date de dernière modification du compte (optionnel, générée par la base)
    Key: string; // Clé unique pour le user

    // ------------------------------
    // Préférences et personnalisation
    // ------------------------------
    theme?: 'clair' | 'sombre'; // Choix du thème de l'application (clair ou sombre)
    luminosite?: string; // Luminosité personnalisée en pourcentage (ex: '75%')
    police?: string;                   // Police préférée de l'utilisateur
    cookie?: boolean;                  // Acceptation des cookies
    actif?: boolean;                   // Indique si le compte est actif (redondant avec isActive mais peut servir à autre logique interne)
}