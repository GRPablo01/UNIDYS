import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avis } from './avis-display.service';

@Injectable({ providedIn: 'root' })
export class AvisCreateService {
  private apiUrl = 'http://localhost:3000/api/avis';

  constructor(private http: HttpClient) {}

  createAvis(avis: Partial<Avis>): Observable<Avis> {
    return this.http.post<Avis>(this.apiUrl, avis);
  }
}
