import { Component, OnInit } from '@angular/core';
import { Icon } from "../../icon/icon";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Utilisateur {
  nom: string;
  prenom: string;
  photoProfil?: string;
  initiale?: string;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [Icon, CommonModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
})
export class Profil implements OnInit {

  utilisateur!: Utilisateur | null;

  // Gestion du thème
  theme: string = 'clair';

  text!: string;

  background!: string;
  rouge!: string;
  Logo!: string;

  hoverProfil = false;
  hoverParam = false;
  hoverDeconnect = false;


  Forme: string = '';

  Header: string = '';
  Header2: string = '';
  Background: string = '';
  Background2: string = '';
  BoutonP: string = '';
  BoutonS: string = '';
  Titre: string = '';
  Texte: string = '';
  Cartes: string = '';
  Bordures: string = '';
  Succes: string = '';
  Erreur: string = '';
  Info: string = '';

  hoverUser: boolean = false;
  hoverLogout = false;


  menuOpen = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadUtilisateur();
    this.loadTheme();        // <-- récupère le thème depuis le localStorage
    this.setThemeColors();   // <-- applique les couleurs selon le thème
  }

  // Chargement de l'utilisateur depuis le localStorage
  private loadUtilisateur(): void {
    const data = localStorage.getItem('utilisateur');

    if (data) {
      const utilisateurComplet = JSON.parse(data);

      this.utilisateur = {
        nom: utilisateurComplet.nom,
        prenom: utilisateurComplet.prenom,
        photoProfil: utilisateurComplet.photoProfil
          ? `http://localhost:3000${utilisateurComplet.photoProfil}`
          : undefined,
        initiale: utilisateurComplet.initiale,
      };
    } else {
      this.utilisateur = null;
    }
  }

  // Récupération du thème depuis le localStorage
  private loadTheme(): void {
    const themeStorage = localStorage.getItem('theme');
    if (themeStorage === 'sombre' || themeStorage === 'clair') {
      this.theme = themeStorage;
    } else {
      this.theme = 'clair';
    }
  }

  // Changer le thème dynamiquement
  changeTheme(nouveauTheme: 'clair' | 'sombre') {
    this.theme = nouveauTheme;
    localStorage.setItem('theme', nouveauTheme);
    this.setThemeColors();
  }

  // Getter photo
  get photoUtilisateur(): string {
    return this.utilisateur?.photoProfil || 'assets/bg2.jpg';
  }

  // Gestion des initiales
  getInitiales(): string {
    if (!this.utilisateur) return '';
    return this.utilisateur.initiale ||
      ((this.utilisateur.nom?.[0] || '') + (this.utilisateur.prenom?.[0] || ''));
  }

  // Vérifie si l’utilisateur a une photo
  hasPhoto(): boolean {
    return !!this.utilisateur?.photoProfil;
  }

  // Gestion des erreurs de chargement
  onImageError(event: any) {
    event.target.src = 'assets/bg2.jpg';
  }

  /**
   * Définit les couleurs selon le thème
   */
  private setThemeColors(): void {
    if (this.theme === 'sombre') {

      this.Header = '#020617';
      this.Header2 = '#344076';
      this.Background = '#0F172A';
      this.Background2 = '#0F172A';
      this.BoutonP = '#FDBA74';
      this.BoutonS = '#93C5FD';
      this.Titre = '#FFFFFF';
      this.Texte = '#E5E7EB';
      this.Cartes = '#1E293B';
      this.Bordures = '#334155';
      this.Succes = '#6EE7B7';
      this.Erreur = '#FCA5A5';
      this.Info = '#67E8F9';

      

      this.Logo = 'assets/IconBlanc.svg'; this.Forme = 'assets/formeclair.png';
    } else {

      this.Header = '#166534';
      this.Header2 = '#082915';
      this.Background = '#F8FAFC';
      this.Background2 = '#F8FAFC';
      this.BoutonP = '#EA580C';
      this.BoutonS = '#1E3A8A';
      this.Titre = '#1F2933';
      this.Texte = '#000000';
      this.Cartes = '#FFFFFF';
      this.Bordures = '#CBD5E1';
      this.Succes = '#15803D';
      this.Erreur = '#DC2626';
      this.Info = '#0F4C5C';

      this.Logo = 'assets/IconBlack.svg'; this.Forme = 'assets/formeclair.png';
    }
  }

  // Gestion du menu utilisateur
  openMenu() {
    this.menuOpen = true;
  }

  keepMenuOpen() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  // Déconnexion
  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }
}
