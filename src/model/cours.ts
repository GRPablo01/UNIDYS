export interface QCM {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
}

export interface Cours {
  _id: string,
  titre: string,
  niveau: string,
  matiere: string,
  nomProf: string,
  fichierPdf: string,
  lienYoutube?: string,
  imageUrl: string,
  pdfUrl?: string,
  qcms?: QCM[],
  qcmsFait?: boolean; // true si l'utilisateur a fait le QCM
}


