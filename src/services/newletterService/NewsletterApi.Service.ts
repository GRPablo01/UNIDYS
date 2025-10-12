import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsletterApiService {
  private apiUrl = 'http://localhost:3000/api/unidys/newsletters';

  constructor(private http: HttpClient) {}

  inscrire(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { email });
  }

  verifier(email: string): Observable<{ inscrit: boolean }> {
    return this.http.get<{ inscrit: boolean }>(`${this.apiUrl}/check?email=${email}`);
  }
}
