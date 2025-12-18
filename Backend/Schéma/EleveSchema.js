// ==================================================
// 📄 models/eleve.schema.ts (Schéma Mongoose pour Eleve basé sur IEleve)
// ==================================================
import { Schema } from 'mongoose';

export const EleveSchema = new Schema({
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
    
    dysListe: [{ type: String }],
    xp: { type: Number, default: 0 },
    cours: [{ type: Schema.Types.ObjectId, ref: 'Cours' }],
    qcm: [{ type: Schema.Types.ObjectId, ref: 'Qcm' }],
    suivi: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['prof','parent','eleve'] }, dateDebut: { type: Date, default: Date.now } }],
    abonnement: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['prof','parent','eleve'] }, dateDebut: { type: Date, default: Date.now } }]
}, { timestamps: true });