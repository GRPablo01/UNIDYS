// ==================================================
// 📄 models/parent.interface.model.ts (Interface TypeScript pour Parent)
// ==================================================

import { IUser } from '../Model/UserModel';

export interface IParent extends IUser {
    userId: string; // Référence vers le User associé
    codeParent?: string; // Code unique du parent
    enfants?: string[]; // IDs des enfants (élèves)

    // ------------------------------
    // Suivi et abonnement
    // ------------------------------
    suivi?: { // Élèves ou autres utilisateurs qui suivent ce parent
        userId: string;
        role: 'eleve' | 'prof';
        dateDebut?: Date;
    }[];
    abonnement?: { // Liste des utilisateurs que ce parent suit ou auxquels il est abonné
        userId: string;
        role: 'eleve' | 'prof';
        dateDebut?: Date;
    }[];
}