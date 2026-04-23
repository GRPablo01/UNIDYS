export interface QCM {
    question: string;
    reponses: string[];
    bonneReponse: number;
    xp: number;
  }
  
  export interface Cours {
    _id?: string;
    titre: string;
    niveau: string;
    matiere: string;
    nomProf: string;
    lienYoutube?: string;
    fichierPdf?: string;
    utilisateurId: string;
    coursKey?: string;
    qcms?: QCM[];
    dysTypes?: string[];
    modules?: {
      nomModule: string;
      sousModules?: string[];
    }[];                         // ajouté
    createdAt?: string;          // ajouté
    updatedAt?: string;          // ajouté
    dejaAjoute?: boolean;
  }