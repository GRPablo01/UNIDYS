import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface User avec key obligatoire
export interface User {
  _id: string;
  key: string;           // 🔑 Utilisation de key au lieu de _id
  nom: string;
  prenom: string;
  email: string;
  role: 'eleve' | 'prof' | 'admin';
  photo?: string | null;
  photoProfil?: string | null;
  initiale?: string | null;
  token?: string | null;
  theme?: string | null;
  font?: string | null;
  eleveRelations?: string | null;
  luminosite?: string | null;
  relations?: string[]; // ⚡ pour stocker les relations
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private utilisateur: User | null = null;
  private readonly userKey = 'utilisateur'; // clé pour localStorage

  constructor(private http: HttpClient) {
    const data = localStorage.getItem(this.userKey);
    if (data) this.utilisateur = JSON.parse(data);
  }

  // ---------- Gestion utilisateur localStorage ----------
  getInitiales(): string {
    return this.utilisateur?.initiale || 'IN';
  }

  setUser(user: User) {
    this.utilisateur = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('token');
  }

  getUser(): User | null {
    return this.utilisateur;
  }

  getNomComplet(): string {
    return this.utilisateur ? `${this.utilisateur.prenom} ${this.utilisateur.nom}` : 'Invité';
  }

  getUserComplet(): User | null {
    if (!this.utilisateur) return null;

    return {
      _id: this.utilisateur._id,
      key: this.utilisateur.key,
      nom: this.utilisateur.nom,
      prenom: this.utilisateur.prenom,
      email: this.utilisateur.email,
      role: this.utilisateur.role,
      photo: this.utilisateur.photoProfil || this.utilisateur.photo || null,
      initiale: this.utilisateur.initiale || null,
      token: this.utilisateur.token || null,
      theme: this.utilisateur.theme || null,
      font: this.utilisateur.font || null,
      luminosite: this.utilisateur.luminosite || null,
      relations: this.utilisateur.relations || [],
    };
  }

  // ---------- API calls ----------
  // Récupérer l'utilisateur connecté via token
  getUserFromApi(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  // Mettre à jour l'utilisateur dans le localStorage
  updateUser(updatedUser: User): User {
    this.setUser(updatedUser);
    return updatedUser;
  }

  // Ajouter un cours à un élève via key
  ajouterCoursUtilisateur(eleveKey: string, coursKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajouter-cours`, { eleveKey, coursKey });
  }

  // Récupérer la liste des cours d’un utilisateur via key
  getCoursUtilisateur(eleveKey: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/users/cours/${eleveKey}`);
  }

  // Vérifier si un email existe déjà
  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(
      `${this.apiUrl}/auth/check-email`,
      { email }
    );
  }

  // Récupérer tous les utilisateurs
  getAllUsersFromApi(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  addRelation(userKey: string, targetKey: string) {
    return this.http.post('http://localhost:3000/api/users/relations', { userKey, targetKey });
  }

  // Récupérer un utilisateur spécifique via key
  getUserByKey(key: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/key/${key}`);
  }
}