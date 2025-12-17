// ==================================================
// 📄 models/user.schema.ts (Schéma Mongoose pour User basé sur IUser)
// ==================================================
import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['eleve', 'prof', 'parent'], required: true },
    initiales: { type: String },
    avatar: { type: String },
    cguValide: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    Key: { type: String, required: true, unique: true },
    theme: { type: String, enum: ['clair', 'sombre'], default: 'clair' },
    luminosite: { type: String },
    police: { type: String },
    cookie: { type: Boolean, default: '' },
}, { timestamps: true });