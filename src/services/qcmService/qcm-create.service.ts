import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QcmResult {
  userId: string;
  qcmId: string;
  score: number;
  reponses: number[];
  xpGagne: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class QcmCreateService {
  private apiBase = 'http://localhost:3000/api/qcm';

  constructor(private http: HttpClient) {}

  // Envoyer les réponses et sauvegarder le résultat
  submitQcmResult(result: Partial<QcmResult>): Observable<QcmResult> {
    return this.http.post<QcmResult>(`${this.apiBase}/results`, result);
  }
}
