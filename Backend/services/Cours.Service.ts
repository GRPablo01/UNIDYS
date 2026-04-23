import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cours } from '../src/Model/Cours';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl = 'http://localhost:3000/api/cours';
  private qcmFaitUrl = 'http://localhost:3000/api/unidys/qcm/fait'; // endpoint pour QCM fait

  constructor(private http: HttpClient) { }

  // Récupère tous les cours d'un professeur
  getCoursParNomProf(nomProf: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/prof/${encodeURIComponent(nomProf)}`);
  }

  // Même chose que getCoursParNomProf → tu peux éventuellement supprimer cette méthode si inutile
  getCoursParUtilisateur(nomProf: string): Observable<Cours[]> {
    return this.getCoursParNomProf(nomProf);
  }

  // Récupère le contenu HTML d'un PDF par ID
  getPdfHtmlById(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/pdfhtml/${id}`, { responseType: 'text' });
  }

  // Modifier un cours
  modifierCours(id: string, data: any): Observable<Cours> {
    return this.http.put<Cours>(`${this.apiUrl}/${id}`, data);
  }

  // Récupère les cours par niveau et matière
  getCoursParNiveauEtMatiere(niveau: string, matiere: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}?niveau=${encodeURIComponent(niveau)}&matiere=${encodeURIComponent(matiere)}`);
  }

  // Récupère tous les cours
  getCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl);
  }

  // Vérifie si un utilisateur a déjà fait le QCM
  hasUserDoneQcm(coursId: string, userId: string): Observable<boolean> {
    return this.http.get<{fait: boolean}>(`${this.qcmFaitUrl}/${coursId}/${userId}`).pipe(
      map(res => res.fait),
      catchError(() => of(false))
    );
  }

  getCoursByKey(coursKey: string) {
    return this.http.get<Cours>(`${this.apiUrl}/cours/key/${coursKey}`);
  }

  getCoursById(id: string) {
    return this.http.get<Cours>(`http://localhost:3000/api/cours/${id}`);
  }
  
  getCoursComplet(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/cours/complet/${id}`);
  }
  
  
}
