import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  initiale: string;
  club?: string;
  equipe: string;
  membreDepuis?: Date;
  role: string;
  photoURL?: string;
  joueurs?: any[];
  categorie?: string;
  poste?: string;
  jour?: string;
  status:string
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private readonly baseUrl = 'http://localhost:3000/api/utilisateurs';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());

  constructor(private http: HttpClient) {}

  private getUserFromLocalStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const u = JSON.parse(userStr);
      return { ...u, id: u.id ?? u._id };
    } catch { return null; }
  }

  // =========================
  // 🔸 Gestion de l’utilisateur courant
  // =========================
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.currentUserSubject.value);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  clearCurrentUser(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map(users => users.filter(u => u.role?.toLowerCase() !== 'admin' && u.role?.toLowerCase() !== 'super admin')),
      catchError(err => { console.error(err); return of([]); })
    );
  }

  getJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(catchError(err => { console.error(err); return of([]); }));
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(catchError(err => throwError(() => err)));
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`).pipe(catchError(err => throwError(() => err)));
  }

  updateUser(userId: string, data: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, data).pipe(catchError(err => throwError(() => err)));
  }
}





