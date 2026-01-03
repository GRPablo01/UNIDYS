import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../../Backend/Services/User/Auth.Service';
import { Icon } from '../icon/icon';

export interface SessionUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  initiale: string;
  avatar?: string;
  cookie: string;
  theme?: string;
  police?: string;
  luminosite?: number;
  cguValide?: boolean;

  Key?: string;
 
  dysListe?: any[];
  xp?: number;
  cours?: any[];
  qcm?: any[];
  suivi?: any[];
  abonnement?: any[];

  codeProf?: string;
  coursCrees?: any[];
  qcmCrees?: any[];
  parentKey?: string;
  codeParent?: string;
  enfants?: any[];
  status?: any;
  eleveRelations?: any[];

  password?: string;
  photoProfil?: string;
  key?: string;
  font?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Icon],
})
export class Login {
  passwordVisible = false;
  isLoading = false;
  errorMessage: string | null = null;
  formSubmitted = false;
  rememberMe = false;
  message: string | null = null;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const savedLogin = localStorage.getItem('loginData');
    if (savedLogin) {
      try {
        const { email, password } = JSON.parse(savedLogin);
        this.connexionData.email = email;
        this.connexionData.password = password;
        this.rememberMe = true;
      } catch {
        localStorage.removeItem('loginData');
      }
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password && password.length >= 6;
  }

  private saveUserSession(user: any): void {
    // 🔒 Stockage complet de l'utilisateur tel quel dans le localStorage
    localStorage.setItem('utilisateur', JSON.stringify(user));

    // 🔄 Mise à jour du AuthService
    this.authService.setUser(user);

    //console.log('🎯 Utilisateur stocké complet :', user);
  }

  valider(): void {
    this.formSubmitted = true;
    if (!this.formulaireValide()) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.http
      .post('http://localhost:3000/api/unidys10/login', this.connexionData)
      .subscribe({
        next: (res: any) => {
          const user = res.user || res;
          if (!user) {
            this.errorMessage = 'Erreur serveur : utilisateur manquant';
            this.isLoading = false;
            return;
          }

          this.saveUserSession(user);

          if (this.rememberMe) {
            localStorage.setItem(
              'loginData',
              JSON.stringify(this.connexionData)
            );
          } else {
            localStorage.removeItem('loginData');
          }

          const routeMap: Record<string, string> = {
            admin: '/accueil',
            prof: '/accueil',
            eleve: '/accueil',
            parent: '/accueil',
            invité: '/accueil',
          };

          const roleKey = (user.role || 'invité').toLowerCase();
          const destination = routeMap[roleKey] || '/accueil';

          setTimeout(() => {
            this.router.navigate([destination]);
            this.isLoading = false;
            this.message = `Bienvenue ${user.prenom} !`;
          }, 500);
        },

        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      });
  }

  deconnecter(): void {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('loginData');
    this.authService.clearUser();
    this.router.navigate(['/connexion']);
  }
}
