import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-footer-p',
  templateUrl: './footer-p.html',
  styleUrls: ['./footer-p.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule,Icon],
})
export class FooterP {
  private http = inject(HttpClient);

  email = localStorage.getItem('email') ?? '';
  inscrit = signal<boolean>(false);

  constructor() {
    // Initialiser avec localStorage pour éviter le "clignotement"
    const inscritLocal = localStorage.getItem('newsletterInscrit');
    this.inscrit.set(inscritLocal === 'true');

    // Vérifie en backend aussi (si email dispo)
    this.verifierInscription();
  }

  verifierInscription() {
    if (!this.email) return;

    this.http.get<{ inscrit: boolean }>(`http://localhost:3000/api/unidys/newsletters/check?email=${this.email}`)
      .subscribe({
        next: (res) => {
          this.inscrit.set(res.inscrit);
          localStorage.setItem('newsletterInscrit', res.inscrit ? 'true' : 'false');
        },
        error: () => {
          this.inscrit.set(false);
          localStorage.setItem('newsletterInscrit', 'false');
        }
      });
  }

  enregistrerEmail() {
    if (!this.email) {
      alert("Aucun utilisateur connecté.");
      return;
    }

    const payload = { email: this.email };

    this.http.post('http://localhost:3000/api/unidys/newsletters', payload).subscribe({
      next: () => {
        alert(`Merci pour votre inscription : ${this.email}`);
        this.inscrit.set(true);
        localStorage.setItem('newsletterInscrit', 'true');
      },
      error: (err) => {
        if (err.status === 409) {
          this.inscrit.set(true);
          localStorage.setItem('newsletterInscrit', 'true');
          alert('Vous êtes déjà inscrit à la newsletter.');
        } else {
          console.error(err);
          alert("Erreur lors de l'inscription à la newsletter.");
        }
      }
    });
  }
}
