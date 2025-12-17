// ==================================================
// 📄 models/prof.interface.model.ts (Interface TypeScript pour Prof)
// ==================================================

import { IUser } from '../Model/UserModel';

export interface IProf extends IUser {
    userId: string; // Référence vers le User associé
    codeProf?: string; // Code unique du professeur
    matieres?: string[]; // Matières enseignées
    coursCrees?: string[]; // IDs des cours créés
    qcmCrees?: string[]; // IDs des QCM créés

    // ------------------------------
    // Suivi et abonnement
    // ------------------------------
    suivi?: { // Élèves ou autres utilisateurs qui suivent ce prof
        userId: string;
        role: 'eleve' | 'parent';
        dateDebut?: Date;
    }[];
    abonnement?: { // Liste des utilisateurs que ce prof suit ou auxquels il est abonné
        userId: string;
        role: 'eleve' | 'parent';
        dateDebut?: Date;
    }[];
}