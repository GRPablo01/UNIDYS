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
  isActive?: boolean;
  Key?: string;
  // Champs spécifiques selon rôle
  eleveKey?: string;
  dysListe?: any[];
  xp?: number;
  cours?: any[];
  qcm?: any[];
  suivi?: any[];
  abonnement?: any[];
  profKey?: string;
  codeProf?: string;
  coursCrees?: any[];
  qcmCrees?: any[];
  parentKey?: string;
  codeParent?: string;
  enfants?: any[];
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
  ) {}

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
    // -------------------------------
    // 🔹 Infos communes à tous les utilisateurs
    // -------------------------------
    const sessionUser: any = {
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: (user.role || 'eleve').trim().toLowerCase(),
      initiale: user.initiales || ((user.prenom?.[0] ?? '').toUpperCase() + (user.nom?.[0] ?? '').toUpperCase()),
      avatar: user.avatar 
         ? `http://localhost:3000${user.avatar}`
         : user.photoProfil
           ? `http://localhost:3000${user.photoProfil}`
           : user.roleData?.avatar
             ? `http://localhost:3000${user.roleData.avatar}`
             : '',

      cguValide: user.cguValide ?? false,
      isActive: user.isActive ?? true,
      Key: user.Key || user.roleData?.Key || '',
      theme: user.theme || 'sombre',
      luminosite: user.luminosite ?? 100,
      police: user.police || 'Roboto',
      cookie: user.cookie ?? false,
    };
  
    // -------------------------------
    // 🔹 Infos spécifiques selon le rôle
    // -------------------------------
    if (user.roleData) {
      switch (sessionUser.role) {
        case 'eleve':
          sessionUser.eleveKey = user.roleData.Key || user.Key || '';
          sessionUser.dysListe = user.roleData.dysListe || [];
          sessionUser.xp = user.roleData.xp || 0;
          sessionUser.cours = user.roleData.cours || [];
          sessionUser.qcm = user.roleData.qcm || [];
          sessionUser.suivi = user.roleData.suivi || [];
          sessionUser.abonnement = user.roleData.abonnement || [];
          break;
  
        case 'prof':
          sessionUser.profKey = user.roleData.Key || user.Key || '';
          sessionUser.codeProf = user.roleData.codeProf || '';
          sessionUser.coursCrees = user.roleData.coursCrees || [];
          sessionUser.qcmCrees = user.roleData.qcmCrees || [];
          sessionUser.suivi = user.roleData.suivi || [];
          sessionUser.abonnement = user.roleData.abonnement || [];
          break;
  
        case 'parent':
          sessionUser.parentKey = user.roleData.Key || user.Key || '';
          sessionUser.codeParent = user.roleData.codeParent || '';
          sessionUser.enfants = user.roleData.enfants || [];
          sessionUser.suivi = user.roleData.suivi || [];
          sessionUser.abonnement = user.roleData.abonnement || [];
          break;
      }
    }
  
    // -------------------------------
    // 🔒 Stockage dans le localStorage
    // -------------------------------
    localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
  
    // -------------------------------
    // 🔄 Mise à jour du AuthService
    // -------------------------------
    this.authService.setUser(sessionUser);
  
    // 🔹 Log pour vérification (à supprimer en production)
    console.log('Utilisateur filtré pour la session :', sessionUser);
  }
  

  valider(): void {
    this.formSubmitted = true;
    if (!this.formulaireValide()) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.http
      .post('http://localhost:3000/api/dysone/login', this.connexionData)
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
