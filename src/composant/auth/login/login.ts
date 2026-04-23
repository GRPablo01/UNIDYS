import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from "../../../composant/share/icon/icon";
import { AuthService } from "../../../../Backend/services/userService/Auth.Service";
import { ThemeService } from '../../../../Backend/services/theme.service';
import { Observable } from 'rxjs';

export interface SessionUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  initiale: string;
  photoProfil?: string;
  cookie: string;
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
  hover: boolean = false; // ← ajouter cette ligne
  isLoading = false;
  errorMessage: string | null = null;
  formSubmitted = false;
  rememberMe = false;
  message: string | null = null;

  connexionData = {
    email: '',
    password: '',
  };

  // Observable du mode sombre
  isDarkMode$: Observable<boolean>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    public themeService: ThemeService 
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    console.log('🔹 ngOnInit appelé');

    // Pré-remplir le formulaire si rememberMe est activé
    const savedLogin = localStorage.getItem('loginData');
    if (savedLogin) {
      try {
        const { email, password } = JSON.parse(savedLogin);
        this.connexionData.email = email;
        this.connexionData.password = password || '';
        this.rememberMe = true;
        console.log('Données de connexion pré-remplies :', this.connexionData);
      } catch (err) {
        console.warn('Erreur parsing loginData, suppression', err);
        localStorage.removeItem('loginData');
      }
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    console.log('Password visible:', this.passwordVisible);
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    const valid = !!email && !!password && password.length >= 6;
    console.log('Validation formulaire :', valid, this.connexionData);
    return valid;
  }

  private saveUserSession(user: any): void {
    console.log('🔹 saveUserSession appelé avec :', user);
  
    const fullPhotoUrl = user.photoProfil ? `http://localhost:3000${user.photoProfil}` : '';
  
    let sessionUser: any = {
      _id: user._id,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: (user.role || 'eleve').trim().toLowerCase(),
      photoProfil: fullPhotoUrl,
      initiale:
        user.initiale ||
        ((user.prenom?.[0] ?? '').toUpperCase() +
          (user.nom?.[0] ?? '').toUpperCase()),
  
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 100,
  
      // 🔑 clé unique pour tous les rôles
      key: user.key || '',
    };
  
    switch (sessionUser.role) {
  
      // 🎓 ELEVE
      case 'eleve':
        sessionUser = {
          ...sessionUser,
          xp: user.xp || 0,
          dysListe: user.dysListe || [],
        };
        break;
  
      // 👨‍🏫 PROF
      case 'prof':
        sessionUser = {
          ...sessionUser,
          codeProf: user.codeProf || '',
        };
        break;
  
      // 👨‍👩‍👧 PARENT
      case 'parent':
        sessionUser = {
          ...sessionUser,
          codeParent: user.codeParent || '',
        };
        break;
    }
  
    localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
  
    this.authService.setUser(sessionUser);
  
    console.log('🔹 Utilisateur enregistré dans AuthService et localStorage');
  }

  valider(): void {
    this.formSubmitted = true;
    console.log('🔹 valider() appelé avec données :', this.connexionData);

    if (!this.formulaireValide()) {
      console.warn('Formulaire invalide, arrêt de la connexion');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.http
      .post('http://localhost:3000/api/dysone/login', this.connexionData)
      .subscribe({
        next: (res: any) => {
          console.log('Réponse backend login :', res);

          const user = res.user || res;
          if (!user) {
            console.error('Utilisateur manquant dans la réponse');
            this.errorMessage = 'Erreur serveur : utilisateur manquant';
            this.isLoading = false;
            return;
          }

          this.saveUserSession(user);

          if (this.rememberMe) {
            localStorage.setItem('loginData', JSON.stringify(this.connexionData));
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
          }, 1200);
        },
        error: (err) => {
          console.error('Erreur lors de la requête login :', err);
          this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
          this.isLoading = false;
        }
      });
  }

  deconnecter(): void {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('eleveKey');
    localStorage.removeItem('loginData');
    this.authService.clearUser();
    this.router.navigate(['/connexion']);
  }

  // 🌙 Toggle thème via ThemeService
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  adjustColor(color: string, amount: number): string {
    // Si c'est une couleur hex
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const r = Math.max(0, Math.min(255, (num >> 16) + amount));
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
      const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }
    return color;
  }
}