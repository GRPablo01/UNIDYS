import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JeuService {

  private apiUrl = 'http://localhost:3000/api/jeux';

  constructor(private http: HttpClient) {}

  createJeu(jeu: any): Observable<any> {
    return this.http.post(this.apiUrl, jeu);
  }
}