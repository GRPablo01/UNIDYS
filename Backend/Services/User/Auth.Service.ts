import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilisateur: any = null;
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {
    const data = localStorage.getItem('utilisateur');
    if (data) this.utilisateur = JSON.parse(data);
  }

  // ✅ Sauvegarde complète de l'utilisateur
  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  getUser() {
    return this.utilisateur;
  }

  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  isLoggedIn(): boolean {
    return !!this.utilisateur;
  }

  getUserRole(): string {
    return this.utilisateur?.role?.trim().toLowerCase() || '';
  }

  // 📧 Envoi du lien de réinitialisation par mail
  envoyerLienReinitialisation(email: string) {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/reset-link`, { email })
    );
  }

  async reinitialiserMotDePasse(email: string, password: string) {
    return fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  }
  

 // Confirmer la réinitialisation du mot de passe
 confirmerResetMotDePasse(token: string, motDePasse: string) {
  // ⚠️ Le champ doit correspondre au backend (ici 'password')
  return this.http.post(`${this.apiUrl}/reset-link/confirm`, { token, password: motDePasse }).toPromise();
}
  
  

}
