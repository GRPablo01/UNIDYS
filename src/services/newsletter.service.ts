import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private apiUrl = 'http://localhost:3000/api/unidys/newsletters';

  constructor(private http: HttpClient) {}

  inscrire(email: string) {
    return this.http.post(`${this.apiUrl}`, { email });
  }

  verifier(email: string) {
    return this.http.get<{ inscrit: boolean }>(`${this.apiUrl}/check?email=${email}`);
  }
}
