// =============================
// 🔹 Relations Abonnement / Suivi
// =============================
export interface RelationUser {
  userId: string;
  role: 'prof' | 'eleve' | 'parent';
}

// =============================
// 🔹 Interface User
// =============================
export interface User {
  _id: string;

  // =============================
  // 🔹 Informations de base
  // =============================
  nom: string;
  prenom: string;
  email: string;
  role: 'prof' | 'eleve' | 'parent';
  password?: string;

  // =============================
  // 🔹 Profil
  // =============================
  photoProfil?: string | null;
  initiale?: string;

  // 🔹 Clé unique selon le rôle
  key?: string;
  codeProf?: string;
  codeParent?: string;

  // =============================
  // 🔹 Préférences utilisateur
  // =============================
  theme?: 'clair' | 'sombre';
  font?: 
    | 'Arial'
    | 'Roboto'
    | 'Open Sans'
    | 'Comic Sans'
    | 'Times New Roman'
    | 'Lato'
    | 'Montserrat'
    | string;
  luminosite?: number;

  // =============================
  // 🔹 Données éducatives
  // =============================
  dysListe?: string[];
  xp?: number;

  cours?: {
    _id: string;
    titre?: string;
  }[];

  qcm?: {
    _id: string;
    titre?: string;
  }[];

  // =============================
  // 🔹 Abonnements & Suivis
  // =============================

  /** Comptes que l'utilisateur suit */
  abonnements?: RelationUser[];

  /** Comptes qui suivent l'utilisateur */
  suivis?: RelationUser[];

  // =============================
  // 🔹 Statuts
  // =============================
  status?: {
    enLigne: boolean;
    nePasDeranger: boolean;
    absent: boolean;
  };

  // =============================
  // 🔹 Cookies & Compte
  // =============================
  cookie?: '' | 'accepted' | 'refused';

  compte?: 'actif' | 'desactive' | 'supprime';

  cguValide?: boolean;

  // =============================
  // 🔹 Dates
  // =============================
  createdAt?: string;
  updatedAt?: string;
}
