// ==================================================
// 📄 models/prof.schema.ts (Schéma Mongoose pour Prof basé sur IProf)
// ==================================================
import { Schema } from 'mongoose';

export const ProfSchema = new Schema({
    // 🔹 Nom et prénom concaténés pour identification
    name: {
        type: String,
        required: true,
    },

    // 🔹 Clé unique de l'élève (pour le lien avec l'utilisateur)
    Key: {
        type: String,
        required: true,
        unique: true,
    },

    // 🖼️ Avatar de l’élève
    avatar: {
        type: String,
        default: '',
    },
    
    codeProf: { type: String, unique: true },
    matieres: [{ type: String }],
    coursCrees: [{ type: Schema.Types.ObjectId, ref: 'Cours' }],
    qcmCrees: [{ type: Schema.Types.ObjectId, ref: 'Qcm' }],
    suivi: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['eleve','parent'] }, dateDebut: { type: Date, default: Date.now } }],
    abonnement: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['eleve','parent'] }, dateDebut: { type: Date, default: Date.now } }]
}, { timestamps: true });