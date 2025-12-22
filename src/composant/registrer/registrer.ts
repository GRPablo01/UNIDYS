import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';

import { Icon } from '../../composant/icon/icon';
import { AuthService } from '../../../Backend/Services/User/Auth.Service';

interface EleveRelation {
  role: 'prof' | 'parent';
  nom: string;
  email: string;
}

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword?: string;
  codeProf?: string;
  codeParent?: string;
  key?: string;              // Remplace eleveKey, profKey, parentKey
  role: 'prof' | 'eleve' | 'parent';
  dysListe?: string[];
  cguValide?: boolean;
  initiale?: string;
  photoProfil?: string | null;
  eleveRelations?: EleveRelation[];
  theme?: 'clair' | 'sombre';
  font?: string;
  luminosite?: number;
}

interface SessionUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  initiale: string;
  token: string;
  photoProfil: string;
  codeProf?: string;
  codeParent?: string;
  key?: string;              // Remplace eleveKey, profKey, parentKey
  theme: 'clair' | 'sombre';
  font: string;
  luminosite: number;
  dysListe?: string[];
  cguValide?: boolean;
  xp?: number;
}

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Icon],
  templateUrl: './registrer.html',
})
export class Registrer implements OnInit, OnDestroy {

  inscriptionData: InscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'eleve',
    dysListe: [],
    cguValide: false,
    eleveRelations: [],
    key: '',
    codeProf: '',
    codeParent: '',
    photoProfil: null,
    theme: 'sombre',
    font: 'Roboto',
    luminosite: 50
  };

  etape = 1;
  actif: 'eleve' | 'prof' | 'parent' = 'eleve';
  passwordVisible = false;
  passwordVisible2 = false;
  cguAccepte = false;
  message: string | null = null;
  isLoading = false;
  roles: ('eleve' | 'prof' | 'parent')[] = ['eleve', 'prof', 'parent'];

  photoPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isUploading = false;
  error: string | null = null;

  readonly CODE_PROF = 'PROF2025';
  readonly CODE_PARENT = 'PARENT2025';

  dysList: string[] = ['dyslexie', 'dysorthographie', 'dyscalculie', 'dyspraxie', 'dysphasie', 'autre'];
  themesList: string[] = ['clair', 'sombre'];
  theme: 'clair' | 'sombre' = 'sombre';
  fontsList: string[] = ['Arial', 'Roboto', 'Open Sans', 'Comic Sans', 'Times New Roman', 'Lato', 'Montserrat'];
  font: string = 'Roboto';
  dysSelectionnes: string[] = [];
  luminosite: number = 100;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.loadLocalData();
    this.applyTheme(this.theme);
    this.applyFont(this.font);
    this.applyLuminosite(this.luminosite);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  togglePasswordVisibility() { this.passwordVisible = !this.passwordVisible; }
  togglePasswordVisibility2() { this.passwordVisible2 = !this.passwordVisible2; }

  toggleDys(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    if (checkbox.checked) {
      if (!this.dysSelectionnes.includes(value)) this.dysSelectionnes.push(value);
    } else {
      this.dysSelectionnes = this.dysSelectionnes.filter(d => d !== value);
    }
    this.inscriptionData.dysListe = [...this.dysSelectionnes];
    this.saveLocalData();
  }

  choisirRole(role: 'eleve' | 'prof' | 'parent') {
    this.actif = role;
    this.inscriptionData.role = role;
    this.inscriptionData.key = ''; // réinitialisation du key
    this.saveLocalData();
  }

  isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  passwordsMatch(): boolean {
    return this.inscriptionData.password === this.inscriptionData.confirmPassword;
  }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf, codeParent, dysListe } = this.inscriptionData;
    if (!nom || !prenom) return false;
    if (!this.isEmailValid(email)) return false;
    if (!password || password.length < 6) return false;
    if (role === 'prof' && codeProf !== this.CODE_PROF) return false;
    if (role === 'parent' && codeParent !== this.CODE_PARENT) return false;
    if (role === 'eleve' && (!dysListe || dysListe.length === 0)) return false;
    if (!this.cguAccepte) return false;
    return true;
  }

  onCguChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.cguAccepte = checkbox.checked;
    this.inscriptionData.cguValide = checkbox.checked;
    this.saveLocalData();
  }

  onPhotoSelected(e: Event) {
    this.error = null;
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { this.error = 'Image trop lourde (max 2 Mo).'; return; }
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result;
      this.inscriptionData.photoProfil = reader.result as string;
      this.saveLocalData();
    };
    reader.readAsDataURL(file);
  }

  stepDescription(): string {
  switch (this.etape) {
    case 1: return 'Informations personnelles';
    case 2: return 'Choisir un mot de passe';
    case 3: return 'Personnalisation du profil';
    case 3.5: return 'Photo et rôle';
    case 4: return 'Vérification des informations';
    default: return '';
  }
}

changeFont(newFont: string) {
  if (this.fontsList.includes(newFont)) {
    this.font = newFont;
    this.inscriptionData.font = newFont;
    this.applyFont(newFont);
    this.saveLocalData();
  }
}

changeLuminosite(value: number) {
  const luminosite = Math.min(Math.max(value, 50), 100);
  this.luminosite = luminosite;
  this.inscriptionData.luminosite = luminosite;
  document.body.style.filter = `brightness(${luminosite}%)`;
  this.saveLocalData();
}


  resetPhoto(e: MouseEvent) {
    e.stopPropagation();
    this.photoPreview = null;
    this.selectedFile = null;
    this.inscriptionData.photoProfil = null;
    this.error = null;
    this.saveLocalData();
  }

  valider() {
    if (!this.formulaireValide()) {
      alert('Veuillez compléter tous les champs correctement.');
      return;
    }

    this.isLoading = true;

    const initiale = (this.inscriptionData.prenom[0] ?? '').toUpperCase() + (this.inscriptionData.nom[0] ?? '').toUpperCase();

    // Génération automatique du key
    this.inscriptionData.key = `${Math.floor(Math.random() * 10000)}${this.inscriptionData.role.toUpperCase()}`;

    const formData = new FormData();
    formData.append('nom', this.inscriptionData.nom);
    formData.append('prenom', this.inscriptionData.prenom);
    formData.append('email', this.inscriptionData.email);
    formData.append('password', this.inscriptionData.password);
    formData.append('role', this.inscriptionData.role);
    formData.append('initiale', initiale);
    formData.append('cguValide', String(this.cguAccepte));
    formData.append('theme', this.theme);
    formData.append('font', this.font);
    formData.append('luminosite', String(this.luminosite));
    formData.append('key', this.inscriptionData.key ?? '');

    if (this.inscriptionData.role === 'eleve' && this.inscriptionData.dysListe)
      formData.append('dysListe', JSON.stringify(this.inscriptionData.dysListe));

    if (this.selectedFile)
      formData.append('photoProfil', this.selectedFile);

    this.http.post('http://localhost:3000/api/dysone/users', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) this.isUploading = true;
        else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          const res: any = event.body;
          this.message = 'Bienvenue sur UniDys !';
          this.saveUserSession(res);
          this.clearLocalData();
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/accueil']), 1500);
        }
      },
      error: (err) => {
        this.isUploading = false;
        console.error('Erreur Backend:', err);
        this.message = err?.error?.message || '⚠️ Erreur lors de la création du compte.';
        this.isLoading = false;
      }
    });
  }

  private saveUserSession(user: any): void {
    const fullPhotoUrl = user.photoProfil ? `http://localhost:3000${user.photoProfil}` : '';

    let sessionUser: Partial<SessionUser> = {
      _id: user._id,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: (user.role || 'eleve').trim().toLowerCase(),
      initiale: user.initiale || ((user.prenom?.[0] ?? '').toUpperCase() + (user.nom?.[0] ?? '').toUpperCase()),
      photoProfil: fullPhotoUrl,
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 100,
      key: user.key ?? ''
    };

    if (sessionUser.role === 'eleve') {
      sessionUser = {
        ...sessionUser,
        dysListe: user.dysListe ?? [],
        cguValide: user.cguValide ?? false,
        xp: user.xp ?? 0
      };
    } else if (sessionUser.role === 'prof') {
      sessionUser = { ...sessionUser, codeProf: user.codeProf || '' };
    } else if (sessionUser.role === 'parent') {
      sessionUser = { ...sessionUser, codeParent: user.codeParent || '' };
    }

    localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
    this.authService.setUser(sessionUser as SessionUser);
  }

  private saveLocalData() {
    localStorage.setItem('inscriptionDataTemp', JSON.stringify(this.inscriptionData));
    localStorage.setItem('actifTemp', this.actif);
    localStorage.setItem('etapeTemp', String(this.etape));
  }

  private loadLocalData() {
    const savedData = localStorage.getItem('inscriptionDataTemp');
    const savedActif = localStorage.getItem('actifTemp') as 'eleve' | 'prof' | 'parent' | null;
    const savedEtape = localStorage.getItem('etapeTemp');
    if (savedData) this.inscriptionData = { ...this.inscriptionData, ...JSON.parse(savedData) };
    if (savedActif) this.actif = savedActif;
    if (savedEtape) this.etape = Number(savedEtape);
    this.dysSelectionnes = this.inscriptionData.dysListe ?? [];
    this.photoPreview = this.inscriptionData.photoProfil ?? null;
    this.cguAccepte = this.inscriptionData.cguValide ?? false;
    this.theme = this.inscriptionData.theme ?? 'sombre';
    this.font = this.inscriptionData.font ?? 'Roboto';
    this.luminosite = this.inscriptionData.luminosite ?? 100;
  }

  private clearLocalData() {
    localStorage.removeItem('inscriptionDataTemp');
    localStorage.removeItem('actifTemp');
    localStorage.removeItem('etapeTemp');
  }

  private applyTheme(theme: 'clair' | 'sombre') {
    if (theme === 'clair') document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  }

  private applyFont(font: string) {
    document.documentElement.style.setProperty('--font-family', font);
  }

  private applyLuminosite(luminosite: number) {
    document.documentElement.style.setProperty('--luminosite', `${luminosite}%`);
  }
}



// stepDescription(): string {
//   switch (this.etape) {
//     case 1: return 'Informations personnelles';
//     case 2: return 'Choisir un mot de passe';
//     case 3: return 'Personnalisation du profil';
//     case 3.5: return 'Photo et rôle';
//     case 4: return 'Vérification des informations';
//     default: return '';
//   }
// }

// onPhotoSelected(e: Event) {
//   this.error = null;
//   const file = (e.target as HTMLInputElement).files?.[0];
//   if (!file) return;
//   if (file.size > 2 * 1024 * 1024) { this.error = 'Image trop lourde (max 2 Mo).'; return; }
//   this.selectedFile = file;

//   const reader = new FileReader();
//   reader.onload = () => {
//     this.photoPreview = reader.result;
//     this.inscriptionData.photoProfil = reader.result as string;
//     this.saveLocalData();
//   };
//   reader.readAsDataURL(file);
// }

// resetPhoto(e: MouseEvent) {
//   e.stopPropagation();
//   this.photoPreview = null;
//   this.selectedFile = null;
//   this.inscriptionData.photoProfil = null;
//   this.error = null;
//   this.saveLocalData();
// }

// changeTheme(newTheme: 'clair' | 'sombre') {
//   this.theme = newTheme;
//   this.inscriptionData.theme = newTheme;
//   this.applyTheme(newTheme);
//   this.saveLocalData();
// }

// changeFont(newFont: string) {
//   if (this.fontsList.includes(newFont)) {
//     this.font = newFont;
//     this.inscriptionData.font = newFont;
//     this.applyFont(newFont);
//     this.saveLocalData();
//   }
// }

// changeLuminosite(value: number) {
//   const luminosite = Math.min(Math.max(value, 50), 100);
//   this.luminosite = luminosite;
//   this.inscriptionData.luminosite = luminosite;
//   document.body.style.filter = `brightness(${luminosite}%)`;
//   this.saveLocalData();
// }