// ==================================================
// 📄 models/parent.schema.ts (Schéma Mongoose pour Parent basé sur IParent)
// ==================================================
import { Schema } from 'mongoose';

export const ParentSchema = new Schema({
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
    codeParent: { type: String, unique: true },
    enfants: [{ type: Schema.Types.ObjectId, ref: 'Eleve' }],
    suivi: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['eleve','prof'] }, dateDebut: { type: Date, default: Date.now } }],
    abonnement: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['eleve','prof'] }, dateDebut: { type: Date, default: Date.now } }]
}, { timestamps: true });