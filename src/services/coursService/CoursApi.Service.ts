import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cours } from '../../model/cours';

@Injectable({ providedIn: 'root' })
export class CoursApiService {
  private apiUrl = 'http://localhost:3000/api/cours';

  constructor(private http: HttpClient) {}

  getCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl);
  }

  getCoursParNomProf(nomProf: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/prof/${encodeURIComponent(nomProf)}`);
  }

  getCoursById(id: string): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/cours/${id}`);
  }

  getPdfHtmlById(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/pdfhtml/${id}`, { responseType: 'text' });
  }

  modifierCours(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // <-- AJOUT DE LA MÉTHODE DELETE
  deleteCours(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCoursParNiveauEtMatiere(niveau: string, matiere: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}?niveau=${niveau}&matiere=${matiere}`);
  }

  hasUserDoneQcm(coursId: string, userId: string) {
    return this.http.get<{fait: boolean}>(`${this.apiUrl}/${coursId}/${userId}`);
  }
}
