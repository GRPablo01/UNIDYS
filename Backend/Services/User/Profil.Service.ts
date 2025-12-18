import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../User/Auth.Service';

export interface User {
  _id?: string;
  nom: string;
  prenom: string;
  role?: string;
  email?: string;
  initiales?: string; // <-- Ajoute ceci
}


@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  // 🔹 Récupère l’utilisateur actuellement connecté
  getUser(): User | null {
    return this.authService.getUser() || null;
  }

  // 🔹 Définit l’utilisateur connecté
  setUser(user: User | null): void {
    this.authService.setUser(user);
  }

  // 🔹 Récupère les initiales de l’utilisateur
  getInitiales(): string {
    const user = this.getUser();
    if (!user) return 'IN';
    const prenomInitiale = user.prenom?.charAt(0).toUpperCase() || '';
    const nomInitiale = user.nom?.charAt(0).toUpperCase() || '';
    return prenomInitiale + nomInitiale;
  }

  // 🔹 Récupère le nom complet
  getNomComplet(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }

  // 🔹 Récupère le nom d’utilisateur (nom)
  getUsername(): string {
    const user = this.getUser();
    return user ? user.nom : 'Invité';
  }

  // 🔹 Récupère le rôle
  getRole(): string {
    const user = this.getUser();
    return user?.role || 'invité';
  }

  // 🔹 🔹 NOUVEAU : récupère le profil connecté depuis le backend
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // 🔹 Supprime le profil localement
  clearProfile(): void {
    this.authService.clearUser();
  }

  // 🔹 Supprime le compte (côté frontend)
  deleteAccount(): void {
    this.clearProfile();
    console.log('Compte et données utilisateur supprimés définitivement.');
  }

  // 🔹 Récupère tous les utilisateurs (ex: liste des joueurs)
  getAllJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 🔹 Retourne l'ID utilisateur pour le backend
  getUserId(): string | null {
    const user = this.getUser();
    return user?._id || null;
  }
}
