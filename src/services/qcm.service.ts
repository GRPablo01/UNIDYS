// qcm.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QcmService {

  constructor(private http: HttpClient) { }

  /**
   * Récupère les résultats QCM d’un utilisateur connecté par son userId
   * @param userId ID de l'utilisateur connecté
   * @returns Observable contenant un tableau de résultats QCM
   */
  getQcmResultsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/qcmresults?userId=${userId}`);
  }
}
