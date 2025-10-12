import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Avis {
  _id?: string;
  nom: string;
  prenom: string;
  message: string;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class AvisDisplayService {
  private apiUrl = 'http://localhost:3000/api/newsletters'; // collection newsletters

  constructor(private http: HttpClient) {}

  getAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.apiUrl);
  }
}


