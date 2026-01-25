import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../icon/icon';
import { Profil } from "../dossier-Header/profil/profil";
import { Nav } from "../dossier-Header/nav/nav";
import { Notif } from "../dossier-Header/notif/notif";
import { Parametre } from "../dossier-Header/parametre/parametre";
import { Support } from "../dossier-Header/support/support";
import { Login } from "../login/login";
import { Logo } from "../dossier-Header/logo/logo";
import { Icon2 } from '../dossier-Header/icon2/icon2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Icon, Profil, Nav,Icon2, Logo],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {

  nom = '';
  prenom = '';
  email = '';
  role = '';
  photoProfil: string | null = null;
  initiale = '';
  connectedUser: any = null;

  xp = 0;
  key = '';
  font = 'Inter';
  status = 'En ligne';

  // ─────────────── THÈME & COULEURS ───────────────
  theme: 'clair' | 'sombre' = 'clair';
  text = '';
  texte = '';
  titre = '';
  header = '';
  rouge = '';
  background = '';
  background2 = '';
  Logo = '';
  Forme = '';

  Header: string = '';
  Header2: string = '';
  Background: string = '';
  BoutonP: string = '';
  BoutonS: string = '';
  Titre: string = '';
  Texte: string = '';
  Cartes: string = '';
  Bordures: string = '';
  Succes: string = '';
  Erreur: string = '';
  Info: string = '';
  

  
  Image = '';

  hoverBleu = false;
  hoverVert = false;
  hoverViolet = false;
  hoverOrange = false;
  hoverProfil = false;
  hoverSettings = false;
  hoverLogout = false;





  menuOpen = false;
  menuMobileOpen = false;

  notificationsCount = 3;

  constructor(
    private renderer: Renderer2,
    private eRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUtilisateur();
    this.setThemeColors();
  }

  private loadUtilisateur(): void {
    const data = localStorage.getItem('utilisateur');
    if (!data) return;

    const utilisateur = JSON.parse(data);
    Object.assign(this, utilisateur);

    if (this.photoProfil && !this.photoProfil.startsWith('http')) {
      this.photoProfil = `http://localhost:3000${this.photoProfil}`;
    }

    if (!this.initiale) {
      this.initiale = ((this.prenom?.[0] || '') + (this.nom?.[0] || '')).toUpperCase();
    }
  }

  private setThemeColors(): void {
    if (this.theme === 'sombre') {

      this.Header = '#020617';
      this.Header2 = '#081962';
      this.Background = '#0F172A';
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
      this.menuMobileOpen = false;
    }
  }

  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }
}
