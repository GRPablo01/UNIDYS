import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilisateur: any = null;

  constructor() {
    const data = localStorage.getItem('utilisateur');
    if (data) {
      this.utilisateur = JSON.parse(data);
    }
  }

  // Sauvegarder l'utilisateur
  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  // Supprimer l'utilisateur
  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  // Accès à l'utilisateur complet
  getUser() {
    return this.utilisateur;
  }

  isLoggedIn(): boolean {
    return !!this.utilisateur;
  }
}
