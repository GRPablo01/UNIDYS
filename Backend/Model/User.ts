export interface EleveRelation {
  role: 'prof' | 'parent';
  nom: string;
  email: string;
}

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'prof' | 'eleve' | 'parent';
  password?: string;

  // Photo de profil
  photoProfil?: string | null;

  // Clé unique selon le rôle
  key?: string;

  codeProf?: string;   
  codeParent?: string; 

  initiale?: string;
  cguValide?: boolean;
  dysListe?: string[];
  xp?: number;

  // Cours et QCM
  cours?: { _id: string; titre?: string }[];
  qcm?: { _id: string; titre?: string }[];

  // Statuts regroupés
  status?: {
    enLigne: boolean;
    nePasDeranger: boolean;
    absent: boolean;
  };

  // Relations de l'élève
  eleveRelations?: EleveRelation[];

  // Thème et police
  theme?: 'clair' | 'sombre';
  font?: 'Arial' | 'Roboto' | 'Open Sans' | 'Comic Sans' | 'Times New Roman' | string;
  luminosite?: number;

  // Cookie
  cookie?: '' | 'accepted' | 'refused';

  // 🔹 Statut global du compte
  compte?: 'actif' | 'desactive' | 'supprime';

  createdAt?: string;
  updatedAt?: string;
}
