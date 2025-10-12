import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cours } from '../model/cours';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl = 'http://localhost:3000/api/cours';
  private apiUrl1 = 'http://localhost:3000/api/unidys/qcm/fait'; // endpoint pour QCM fait

  constructor(private http: HttpClient) { }

  getCoursParNomProf(nomProf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prof/${encodeURIComponent(nomProf)}`);
  }

  getCoursParUtilisateur(nomProf: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prof/${encodeURIComponent(nomProf)}`);
  }

  getCoursById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cours/${id}`);
  }

  getPdfHtmlById(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/pdfhtml/${id}`, { responseType: 'text' });
  }

  modifierCours(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getCoursParNiveauEtMatiere(niveau: string, matiere: string): Observable<Cours[]> {
    return this.http.get<Cours[]>(`http://localhost:3000/api/cours?niveau=${niveau}&matiere=${matiere}`);
  }

  getCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl);
  }

  hasUserDoneQcm(coursId: string, userId: string): Observable<boolean> {
    return this.http.get<{fait: boolean}>(`${this.apiUrl}/${coursId}/${userId}`).pipe(
      map(res => res.fait), 
      catchError(() => of(false))
    );
  }
  
}
