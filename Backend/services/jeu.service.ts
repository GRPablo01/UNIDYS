import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JeuService {

  private apiUrl = 'http://localhost:3000/api/jeux';

  constructor(private http: HttpClient) {}

  // ➕ Créer un jeu
  createJeu(jeu: any): Observable<any> {
    return this.http.post(this.apiUrl, jeu);
  }

  // 📥 Récupérer tous les jeux
  getAllJeux(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getJeuById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}