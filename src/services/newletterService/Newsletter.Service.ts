import { Injectable } from '@angular/core';
import { NewsletterApiService } from '../newletterService/NewsletterApi.Service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private api: NewsletterApiService) {}

  // Inscription avec logique éventuelle (validation, message, etc.)
  inscrire(email: string): Observable<any> {
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide');
    }
    return this.api.inscrire(email);
  }

  // Vérifier si l'email est déjà inscrit
  verifier(email: string): Observable<{ inscrit: boolean }> {
    return this.api.verifier(email);
  }
}
