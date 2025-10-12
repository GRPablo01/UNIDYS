import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Icon } from '../icon/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfileService } from '../../services/userService/Profile.Service';

@Component({
  selector: 'app-footer-e',
  templateUrl: './footer-e.html',
  styleUrls: ['./footer-e.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, FormsModule, Icon],
})
export class FooterE {
  private http = inject(HttpClient); // inject HttpClient directement
  private profileService = inject(ProfileService); // inject ProfileService

  email: string = '';
  inscrit = signal<boolean>(false);
  private apiUrl = 'http://localhost:3000/api/unidys/newsletters';

  constructor() {
    const user = this.profileService.getUser();
    this.email = user?.email ?? '';

    const inscritLocal = localStorage.getItem('newsletterInscrit');
    this.inscrit.set(inscritLocal === 'true');

    this.verifierInscription();
  }

  verifierInscription() {
    if (!this.email) return;

    this.http.get<{ inscrit: boolean }>(`${this.apiUrl}/check?email=${this.email}`)
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

    this.http.post(this.apiUrl, { email: this.email }).subscribe({
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
