// ==========================
// IMPORTS ANGULAR DE BASE
// ==========================
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// ==========================
// SERVICES & COMPOSANTS
// ==========================
import { AuthService } from '../../../Backend/Services/User/Auth.Service';
import { ProfileService, User } from '../../../Backend/Services/User/Profil.Service';
import { Icon } from '../icon/icon';

// ==========================
// INTERFACE UTILISATEUR
// ==========================
export interface SessionUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  initiale: string;
  cookie: string;

  avatar?: string;
  photoProfil?: string;
  theme?: string;
  police?: string;
  font?: string;
  luminosite?: number;
  cguValide?: boolean;

  // état en ligne / indisponible / ne pas déranger
  status?: {
    enLigne?: boolean;
    nePasDeranger?: boolean;
    absent?: boolean;
  };

  // statut du compte : actif / desactive / supprime
  compte?: string;
}

// ==========================
// COMPOSANT LOGIN
// ==========================
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, Icon],
})
export class Login implements OnInit {

  passwordVisible = false;
  isLoading = false;
  formSubmitted = false;
  rememberMe = false;

  errorMessage: string | null = null;
  message: string | null = null;

  connexionData = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  // ==========================
  // INIT
  // ==========================
  ngOnInit(): void {
    console.log('🟢 [Login] ngOnInit');

    const savedLogin = localStorage.getItem('loginData');
    if (savedLogin) {
      try {
        const parsed = JSON.parse(savedLogin);
        console.log('📦 Login sauvegardé trouvé :', parsed);

        this.connexionData.email = parsed.email;
        this.connexionData.password = parsed.password;
        this.rememberMe = true;
      } catch (e) {
        console.error('❌ Erreur parsing loginData', e);
        localStorage.removeItem('loginData');
      }
    }
  }

  // ==========================
  // UI
  // ==========================
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    console.log('👁️ Mot de passe visible :', this.passwordVisible);
  }

  formulaireValide(): boolean {
    const valide =
      !!this.connexionData.email &&
      !!this.connexionData.password &&
      this.connexionData.password.length >= 6;

    console.log('🧪 Formulaire valide ?', valide, this.connexionData);
    return valide;
  }

  // ==========================
  // LOGIN
  // ==========================
  valider(): void {
    console.log('➡️ [Login] Tentative de connexion');
    this.formSubmitted = true;

    if (!this.formulaireValide()) {
      console.warn('⚠️ Formulaire invalide');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    console.log('📡 POST /login', this.connexionData);

    this.http
      .post('http://localhost:3000/api/unidys10/login', this.connexionData)
      .subscribe({
        next: (res: any) => {
          console.log('✅ Réponse login API :', res);

          const sessionUser: SessionUser = res.user || res;

          if (!sessionUser) {
            console.error('❌ Aucun utilisateur dans la réponse');
            this.errorMessage = 'Utilisateur introuvable';
            this.isLoading = false;
            return;
          }

          console.log('👤 Utilisateur reçu :', sessionUser);

          // 🔍 Vérification du compte réel dans la liste
          this.verifierStatutViaListe(sessionUser.email);
        },
        error: (err) => {
          console.error('❌ Erreur login API', err);
          this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
          this.isLoading = false;
        },
      });
  }

  // ==========================
  // VÉRIFICATION STATUT RÉEL DU COMPTE
  // ==========================
  private verifierStatutViaListe(email: string): void {
    console.log('🔎 Vérification du compte utilisateur pour :', email);

    this.profileService.getAllJoueurs().subscribe({
      next: (users: User[]) => {
        console.log('📥 Liste utilisateurs reçue :', users);

        const userTrouve = users.find(
          u => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (!userTrouve) {
          console.error('❌ Compte introuvable dans /users');
          this.errorMessage = 'Compte introuvable';
          this.isLoading = false;
          return;
        }

        console.log('👤 Utilisateur trouvé dans la liste :', userTrouve);

        // ✅ Normalisation du statut du compte
        let statutCompte = 'actif'; // valeur par défaut
        if (userTrouve.compte) {
          statutCompte = userTrouve.compte.toLowerCase();
        }

        console.log('📌 Statut réel du compte :', statutCompte);

        // ==========================
        // REDIRECTION SELON STATUT
        // ==========================
        switch (statutCompte) {
          case 'actif':
            this.finaliserConnexion(userTrouve, '/accueil', `Bienvenue ${userTrouve.prenom} !`);
            break;
          case 'desactive':
            this.finaliserConnexion(userTrouve, '/attents', 'Votre compte est désactivé.');
            break;
          case 'supprime':
            this.finaliserConnexion(userTrouve, '/attents', 'Votre compte a été supprimé.');
            break;
          default:
            console.warn('⚠️ Statut inconnu, redirection vers /connexion');
            this.finaliserConnexion(userTrouve, '/connexion', null);
            break;
        }
      },
      error: (err) => {
        console.error('❌ ERREUR API getAllJoueurs()', err);
        this.errorMessage = 'Impossible de vérifier le statut du compte';
        this.isLoading = false;
      }
    });
  }

  // ==========================
  // FINALISATION DE LA CONNEXION
  // ==========================
  private finaliserConnexion(user: User, route: string, message: string | null): void {
    console.log('🚀 Finalisation connexion pour', user.email);

    localStorage.setItem('utilisateur', JSON.stringify(user));
    this.authService.setUser(user as SessionUser);

    if (this.rememberMe) {
      localStorage.setItem('loginData', JSON.stringify(this.connexionData));
      console.log('💾 Login sauvegardé');
    } else {
      localStorage.removeItem('loginData');
    }

    setTimeout(() => {
      console.log(`➡️ Navigation vers ${route}`);
      this.router.navigate([route]);
      this.isLoading = false;
      this.message = message;
    }, 500);
  }

  // ==========================
  // LOGOUT
  // ==========================
  deconnecter(): void {
    console.log('👋 Déconnexion');
    localStorage.clear();
    this.authService.clearUser();
    this.router.navigate(['/connexion']);
  }
}
