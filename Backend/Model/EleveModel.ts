// ==================================================
// 📄 models/eleve.interface.model.ts (Interface TypeScript pour Eleve)
// ==================================================

// Interface TypeScript pour un élève UniDys
import { IUser } from '../Model/UserModel';

export interface IEleve extends IUser {
    userId: string;                 // Référence vers le User associé
    niveau?: string;                // Niveau scolaire (ex: CE2, CM1)
    dysListe?: string[];            // Liste des troubles DYS
    xp?: number;                    // Points de progression
    cours?: string[];               // Liste des IDs des cours suivis
    qcm?: string[];                 // Liste des IDs des QCM

    // ------------------------------
    // Suivi et abonnement
    // ------------------------------
    suivi?: {                        // Professeurs, parents ou autres élèves qui suivent cet élève
        userId: string;
        role: 'prof' | 'parent' | 'eleve';
        dateDebut?: Date;
    }[];
    abonnement?: {                   // Liste des utilisateurs que cet élève suit ou auxquels il est abonné
        userId: string;
        role: 'prof' | 'parent' | 'eleve';
        dateDebut?: Date;
    }[];
}