import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private utilisateur: {
    _id: string;
    prenom: string;
    nom: string;
    email: string;
    role: string;
    initiale: string;
  } | null = null;

  constructor() {
    const data = localStorage.getItem('utilisateur');
    if (data) {
      this.utilisateur = JSON.parse(data);
    }
  }

  // ✅ Initiales calculées ou récupérées
  getInitiales(): string {
    return this.utilisateur?.initiale || 'IN';
  }

  // ✅ Sauvegarder l'utilisateur
  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  // ✅ Supprimer l'utilisateur
  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  // ✅ Accès à l'utilisateur complet
  getUser() {
    return this.utilisateur;
  }

  getUtilisateur() {
    return this.utilisateur;
  }

  // ✅ Correction ici : utiliser this.utilisateur au lieu de this.user
  getNomComplet(): string {
    return this.utilisateur ? `${this.utilisateur.prenom} ${this.utilisateur.nom}` : 'Invité';
  }
}
