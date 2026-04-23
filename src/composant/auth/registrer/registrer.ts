import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../Backend/services/userService/Auth.Service';
import { Icon } from '../../share/icon/icon';

// ==============================
// 🔹 Interfaces
// ==============================
interface EleveRelation {
  role: 'prof' | 'parent';
  nom: string;
  email: string;
}

interface Notification {
  message: string;
  time: string;
  read?: boolean;
  icon?: string | null;
  color?: string | null;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword?: string;
  codeProf?: string;
  codeParent?: string;
  profKey?: string;
  parentKey?: string;
  eleveKey?: string;
  role: 'prof' | 'eleve' | 'parent';
  dysListe?: string[];
  cguValide?: boolean;
  initiale?: string;
  photoProfil?: string | null;
  eleveRelations?: EleveRelation[];
  theme?: 'clair' | 'sombre';
  font?: string;
  luminosite?: number;
  notifications?: Notification[];
}

interface SessionUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: 'prof' | 'eleve' | 'parent';
  initiale: string;
  token: string;
  photoProfil: string;
  codeProf?: string;
  codeParent?: string;
  eleveKey?: string;
  profKey?: string;
  parentKey?: string;
  theme: 'clair' | 'sombre';
  font: string;
  luminosite: number;
  dysListe?: string[];
  cguValide?: boolean;
  xp?: number;
  notifications?: Notification[];
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
    eleveKey: '',
    profKey: '',
    parentKey: '',
    codeProf: '',
    codeParent: '',
    photoProfil: null,
    theme: 'sombre',
    font: 'Roboto',
    luminosite: 100,
    notifications: []
  };

  isDarkMode: Observable<boolean>;
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
  isFocused: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    console.log('Constructeur Registrer appelé');
    this.isDarkMode = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    console.log('ngOnInit appelé');
    document.body.style.overflow = 'hidden';
    this.loadLocalData();
    this.applyTheme(this.theme);
    this.applyFont(this.font);
    this.applyLuminosite(this.luminosite);
    console.log('InscriptionData chargé :', this.inscriptionData);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy appelé');
    document.body.style.overflow = 'auto';
  }

  // ==============================
  // 🔹 Gestion mot de passe
  // ==============================
  get passwordStrength(): number {
    const pwd = this.inscriptionData?.password || '';
    if (!pwd) return 0;
    if (pwd.length < 6) return 30;
    if (pwd.length < 10) return 60;
    return 100;
  }

  getPasswordBorderClass(confirm = false): string {
    const pwd = confirm ? this.inscriptionData.confirmPassword : this.inscriptionData.password;
    if (!pwd) return 'border-white/10';
    if (confirm && !this.passwordsMatch()) return 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20';
    return 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20';
  }

  togglePasswordVisibility() { this.passwordVisible = !this.passwordVisible; }
  togglePasswordVisibility2() { this.passwordVisible2 = !this.passwordVisible2; }

  // ==============================
  // 🔹 Gestion troubles dys
  // ==============================
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

    // 🔹 LOG POUR DEBUG
    console.log('Checkbox cliquée:', value, 'État:', checkbox.checked);
    console.log('dysSelectionnes actuel:', this.dysSelectionnes);
    console.log('inscriptionData.dysListe actuel:', this.inscriptionData.dysListe);
  }

  // ==============================
  // 🔹 Gestion rôle
  // ==============================
  choisirRole(role: 'eleve' | 'prof' | 'parent') {
    this.actif = role;
    this.inscriptionData.role = role;

    if (role === 'eleve') {
      this.inscriptionData.codeProf = '';
      this.inscriptionData.codeParent = '';
      this.inscriptionData.profKey = '';
      this.inscriptionData.parentKey = '';
    }

    this.saveLocalData();
    console.log('Rôle choisi:', role);
  }

  // ==============================
  // 🔹 Validation formulaire
  // ==============================
  isEmailValid(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  passwordsMatch(): boolean { return this.inscriptionData.password === this.inscriptionData.confirmPassword; }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf, codeParent, dysListe } = this.inscriptionData;
    let valide = true;
    if (!nom || !prenom) valide = false;
    if (!this.isEmailValid(email)) valide = false;
    if (!password || password.length < 6) valide = false;
    if (role === 'prof' && codeProf !== this.CODE_PROF) valide = false;
    if (role === 'parent' && codeParent !== this.CODE_PARENT) valide = false;
    if (role === 'eleve' && (!dysListe || dysListe.length === 0)) valide = false;
    if (!this.cguAccepte) valide = false;
    return valide;
  }

  onCguChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.cguAccepte = checkbox.checked;
    this.inscriptionData.cguValide = checkbox.checked;
    this.saveLocalData();
  }

  // ==============================
  // 🔹 Gestion photo
  // ==============================
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

  resetPhoto(e: MouseEvent) {
    e.stopPropagation();
    this.photoPreview = null;
    this.selectedFile = null;
    this.inscriptionData.photoProfil = null;
    this.error = null;
    this.saveLocalData();
  }

  // ==============================
  // 🔹 Validation et envoi formulaire
  // ==============================
  valider() {
    if (!this.formulaireValide()) {
      alert('Veuillez compléter tous les champs correctement.');
      return;
    }

    this.isLoading = true;
    const initiale = (this.inscriptionData.prenom[0] ?? '').toUpperCase() + (this.inscriptionData.nom[0] ?? '').toUpperCase();
    this.inscriptionData.initiale = initiale;

    if (this.inscriptionData.role === 'eleve') this.inscriptionData.eleveKey = `${Math.floor(Math.random() * 1000)}GFSDH`;
    if (this.inscriptionData.role === 'prof') this.inscriptionData.profKey = `${Math.floor(Math.random() * 1000)}PROF`;
    if (this.inscriptionData.role === 'parent') this.inscriptionData.parentKey = `${Math.floor(Math.random() * 1000)}PARENT`;

    const formData = new FormData();
    for (const key in this.inscriptionData) {
      if (this.inscriptionData[key as keyof InscriptionData] !== undefined && key !== 'confirmPassword') {
        let value = this.inscriptionData[key as keyof InscriptionData];
        if (Array.isArray(value)) value = JSON.stringify(value);
        formData.append(key, value as any);
      }
    }
    if (this.selectedFile) formData.append('photoProfil', this.selectedFile);

    this.http.post('http://localhost:3000/api/dysone/users', formData, { reportProgress: true, observe: 'events' }).subscribe({
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
        this.message = err?.error?.message || '⚠️ Erreur lors de la création du compte.';
        this.isLoading = false;
        console.error('Erreur création utilisateur:', err);
      }
    });
  }

  // ==============================
  // 🔹 Etapes & personnalisation
  // ==============================
  revenirEtapePrecedente() { if (this.etape > 1) { this.etape--; this.saveLocalData(); } }
  changeTheme(newTheme: 'clair' | 'sombre') { this.theme = newTheme; this.inscriptionData.theme = newTheme; this.applyTheme(newTheme); this.saveLocalData(); }
  changeFont(newFont: string) { if (this.fontsList.includes(newFont)) { this.font = newFont; this.inscriptionData.font = newFont; this.applyFont(newFont); this.saveLocalData(); } }
  changeLuminosite(value: number) { const l = Math.min(Math.max(value, 50), 100); this.luminosite = l; this.inscriptionData.luminosite = l; document.body.style.filter = `brightness(${l}%)`; this.saveLocalData(); }

  private applyTheme(theme: 'clair' | 'sombre') { theme === 'clair' ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark'); }
  private applyFont(font: string) { document.documentElement.style.setProperty('--font-family', font); }
  private applyLuminosite(luminosite: number) { document.documentElement.style.setProperty('--luminosite', `${luminosite}%`); }

  private saveUserSession(user: any): void {
    const fullPhotoUrl = user.photoProfil ? `http://localhost:3000${user.photoProfil}` : '';
    let sessionUser: Partial<SessionUser> = {
      _id: user._id,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: (user.role || 'eleve').trim().toLowerCase(),
      initiale: user.initiale || '',
      photoProfil: fullPhotoUrl,
      theme: user.theme || 'sombre',
      font: user.font || 'Roboto',
      luminosite: user.luminosite ?? 100,
      notifications: user.notifications ?? []
    };

    switch (sessionUser.role) {
      case 'eleve':
        sessionUser = { ...sessionUser, eleveKey: user.eleveKey || '', dysListe: user.dysListe ?? [], cguValide: user.cguValide ?? false, xp: user.xp ?? 0 };
        break;
      case 'prof':
        sessionUser = { ...sessionUser, profKey: user.profKey || '', codeProf: user.codeProf || '' };
        break;
      case 'parent':
        sessionUser = { ...sessionUser, parentKey: user.parentKey || '', codeParent: user.codeParent || '' };
        break;
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

  toggleTheme() { this.themeService.toggleTheme(); }

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

  getStepColor(stepIndex: number): string {
    if (this.etape > stepIndex) return this.themeService.primary;
    return this.isDarkMode ? '#2C2F33' : '#E5E7EB';
  }

  setFocusStyle(focused: boolean) { this.isFocused = focused; }

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