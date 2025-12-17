// ==================================================
// 📦 composant/registrer/registrer.ts
// ==================================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';

import { AuthService } from '../../../Backend/Services/User/Auth.Service';
import { Icon } from '../icon/icon';

// 🔹 Import du type correct pour éviter les doublons TS2345
import { SessionUser } from '../login/login';

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
  role: 'eleve' | 'prof' | 'parent';
  dysListe?: string[];
  cguValide?: boolean;
  initiales?: string;
  photoProfil?: string | null;
  eleveRelations?: EleveRelation[];
  eleveKey?: string;
  profKey?: string;
  parentKey?: string;
  codeProf?: string;
  codeParent?: string;
  theme?: 'clair' | 'sombre';
  police?: string;
  luminosite?: number;
  xp?: number;
}

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Icon],
  templateUrl: './registrer.html',
})
export class Registrer implements OnInit, OnDestroy {

  public theme: 'clair' | 'sombre' = 'sombre';
  public font: string = 'Roboto';
  public luminosite: number = 100;

  public inscriptionData: InscriptionData = {
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
    theme: this.theme,
    police: this.font,
    luminosite: this.luminosite,
    xp: 0
  };

  public etape = 1;
  public actif: 'eleve' | 'prof' | 'parent' = 'eleve';
  public passwordVisible = false;
  public passwordVisible2 = false;
  public cguAccepte = false;
  public message: string | null = null;
  public isLoading = false;
  public photoPreview: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;
  public isUploading = false;
  public error: string | null = null;

  readonly CODE_PROF = 'PROF2025';
  readonly CODE_PARENT = 'PARENT2025';
  dysList: string[] = ['dyslexie', 'dysorthographie', 'dyscalculie', 'dyspraxie', 'dysphasie', 'autre'];
  themesList: string[] = ['clair', 'sombre'];
  fontsList: string[] = ['Arial', 'Roboto', 'Open Sans', 'Comic Sans', 'Times New Roman', 'Lato', 'Montserrat'];
  roles: ('eleve' | 'prof' | 'parent')[] = ['eleve', 'prof', 'parent'];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.loadLocalData();
    this.applyTheme(this.inscriptionData.theme!);
    this.applyFont(this.inscriptionData.police!);
    this.applyLuminosite(this.inscriptionData.luminosite!);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  public togglePasswordVisibility() { this.passwordVisible = !this.passwordVisible; }
  public togglePasswordVisibility2() { this.passwordVisible2 = !this.passwordVisible2; }

  public toggleDys(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    if (checkbox.checked) {
      if (!this.inscriptionData.dysListe?.includes(value)) this.inscriptionData.dysListe?.push(value);
    } else {
      this.inscriptionData.dysListe = this.inscriptionData.dysListe?.filter(d => d !== value) || [];
    }
    this.saveLocalData();
  }

  public choisirRole(role: 'eleve' | 'prof' | 'parent') {
    this.actif = role;
    this.inscriptionData.role = role;
    if (role === 'eleve') {
      this.inscriptionData.codeProf = '';
      this.inscriptionData.codeParent = '';
      this.inscriptionData.profKey = '';
      this.inscriptionData.parentKey = '';
    }
    this.saveLocalData();
  }

  public isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public passwordsMatch(): boolean {
    return this.inscriptionData.password === this.inscriptionData.confirmPassword;
  }

  public formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeProf, codeParent, dysListe } = this.inscriptionData;

    if (!nom || !prenom) return false;
    if (!this.isEmailValid(email)) return false;
    if (!password || password.length < 6) return false;

    if (role === 'prof' && codeProf !== this.CODE_PROF) return false;
    if (role === 'parent' && codeParent?.trim() !== this.CODE_PARENT) return false;
    if (role === 'eleve' && (!dysListe || dysListe.length === 0)) return false;
    if (!this.cguAccepte) return false;

    return true;
  }

  public onCodeRoleChange(value: string) {
    if (this.actif === 'prof') this.inscriptionData.codeProf = value;
    else if (this.actif === 'parent') this.inscriptionData.codeParent = value;
  }

  public onCguChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.cguAccepte = checkbox.checked;
    this.inscriptionData.cguValide = checkbox.checked;
    this.saveLocalData();
  }

  public onImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.photoPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  public onPhotoSelected(event: any) {
    this.onImageChange(event);
  }

  get dysSelectionnes(): string[] {
    return this.inscriptionData.dysListe || [];
  }

  public valider() {
    if (!this.formulaireValide()) {
      alert('Veuillez compléter tous les champs correctement.');
      return;
    }

    this.isLoading = true;

    const initiales = (this.inscriptionData.prenom[0] ?? '').toUpperCase() + (this.inscriptionData.nom[0] ?? '').toUpperCase();
    this.inscriptionData.initiales = initiales;

    if (this.inscriptionData.role === 'eleve') this.inscriptionData.eleveKey = `${Math.floor(Math.random() * 10000)}GFSDH`;
    if (this.inscriptionData.role === 'prof') this.inscriptionData.profKey = `${Math.floor(Math.random() * 10000)}PROF`;
    if (this.inscriptionData.role === 'parent') this.inscriptionData.parentKey = `${Math.floor(Math.random() * 10000)}PARENT`;

    const formData = new FormData();
    Object.entries(this.inscriptionData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) value.forEach(v => formData.append(key, v));
        else formData.append(key, String(value));
      }
    });

    if (this.selectedFile) formData.append('avatar', this.selectedFile);

    this.http.post('http://localhost:3000/api/dysone/users', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
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

  private saveUserSession(user: any) {
    const fullPhotoUrl = user.avatar ? `http://localhost:3000${user.avatar}` : '';

    // ✅ Objet complet conforme au type importé SessionUser
    const sessionUser: SessionUser = {
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      initiale: user.initiales ?? (user.prenom[0] + user.nom[0]),
      cookie: 'false', // valeur par défaut
      avatar: fullPhotoUrl,
      theme: user.theme || 'sombre',
      police: user.police || 'Roboto',
      luminosite: user.luminosite ?? 100,
      eleveKey: user.eleveKey || '',
      profKey: user.profKey || '',
      parentKey: user.parentKey || '',
      codeProf: user.codeProf || '',
      codeParent: user.codeParent || '',
      dysListe: user.dysListe || [],
      cguValide: user.cguValide ?? false,
      xp: user.xp || 0
    };

    localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
    this.authService.setUser(sessionUser);
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
    this.photoPreview = this.inscriptionData.photoProfil ?? null;
    this.cguAccepte = this.inscriptionData.cguValide ?? false;
  }

  private clearLocalData() {
    localStorage.removeItem('inscriptionDataTemp');
    localStorage.removeItem('actifTemp');
    localStorage.removeItem('etapeTemp');
  }

  private applyTheme(theme: 'clair' | 'sombre') {
    document.documentElement.classList.toggle('dark', theme === 'sombre');
  }

  private applyFont(font: string) {
    document.documentElement.style.setProperty('--font-family', font);
  }

  private applyLuminosite(luminosite: number) {
    document.documentElement.style.setProperty('--luminosite', `${luminosite}%`);
  }

  public stepDescription(): string {
    switch (this.etape) {
      case 1: return 'Informations personnelles';
      case 2: return 'Choisir un mot de passe';
      case 3: return 'Personnalisation du profil';
      case 3.5: return 'Photo et rôle';
      case 4: return 'Vérification des informations';
      default: return '';
    }
  }

  public changeFont(newFont: string) {
    if (this.fontsList.includes(newFont)) {
      this.font = newFont;
      this.inscriptionData.police = newFont;
      this.applyFont(newFont);
      this.saveLocalData();
    }
  }

  public changeTheme(newTheme: 'clair' | 'sombre') {
    this.theme = newTheme;
    this.inscriptionData.theme = newTheme;
    this.applyTheme(newTheme);
    this.saveLocalData();
  }

  public changeLuminosite(value: number) {
    const luminosite = Math.min(Math.max(value, 50), 100);
    this.inscriptionData.luminosite = luminosite;
    this.applyLuminosite(luminosite);
    this.saveLocalData();
  }
}
