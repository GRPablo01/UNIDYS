export interface CoursUser {
  _id?: string;
  utilisateurId: string;
  titre: string;
  niveau: string;
  etat?: 'termine' | 'en_cours' | 'non_debute' | string;
}
