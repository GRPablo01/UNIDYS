import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Newsletter {
  private apiUrl = 'http://localhost:3000/api/newsletter';

  constructor(private http: HttpClient) {}

  inscrire(email: string) {
    return this.http.post<{ message: string }>(this.apiUrl, { email });
  }
}
