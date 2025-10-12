import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from '../../component/icon/icon';
import { Logo } from '../../component/logo/logo';
import { AuthService } from '../../services/userService/Auth.Service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Icon, Logo],
})
export class Connexion {
  passwordVisible = false;
  isLoading = false;
  message: string | null = null;
  errorMessage: string | null = null;
  redirectionApresConnexion: string | null = null;
  formSubmitted = false;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password && password.length >= 6;
  }

  valider(): void {
    this.formSubmitted = true;

    if (!this.formulaireValide()) return;

    this.isLoading = true;
    const { email, password } = this.connexionData;

    this.http.post('http://localhost:3000/api/unidys/login', { email, password }).subscribe({
      next: (user: any) => {
        if (!user.initiale && user.prenom && user.nom) {
          user.initiale = (user.prenom[0] ?? '').toUpperCase() + (user.nom[0] ?? '').toUpperCase();
        }

        this.authService.setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        if ((user.role || '').toLowerCase().includes('prof')) {
          const nomProf = `${user.prenom} ${user.nom}`;
          localStorage.setItem('nomProf', nomProf);
        }

        this.message = 'Bienvenue sur UniDys !';

        const roleRaw = (user.role || '').toLowerCase();
        let roleKey: string;
        if (roleRaw.includes('admin')) roleKey = 'admin';
        else if (roleRaw.includes('prof')) roleKey = 'prof';
        else roleKey = 'eleve';

        const routeMap: { [key: string]: string } = {
          admin: '/accueilA',
          prof: '/accueilP',
          eleve: '/accueilE',
        };
        this.redirectionApresConnexion = routeMap[roleKey];

        setTimeout(() => {
          this.router.navigate([this.redirectionApresConnexion!]);
          this.message = null;
          this.redirectionApresConnexion = null;
          this.isLoading = false;
        }, 1200);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        this.isLoading = false;
        console.error('Erreur de connexion :', err);
      },
    });
  }

  deconnecter(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('nomProf');
    this.authService.clearUser();
    this.router.navigate(['/connexion']);
  }
}
