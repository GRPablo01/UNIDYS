import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Icon],
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

  theme: 'clair' | 'sombre' = 'clair';
  text = '';
  rouge = '';
  background = '';

  bgblue = ''; bggreen = ''; bgpurple = ''; bgpink = ''; bgyellow = '';
  textblue = ''; textgreen = ''; textpurple = ''; textpink = ''; textyellow = '';

  Logo = '';

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
      this.text = '#FFF';
      this.background = '#001219';
      this.rouge = '#b80000';

      this.bgblue='#1E40AF'; this.textblue='#93C5FD';
      this.bggreen='#065F46'; this.textgreen='#6EE7B7';
      this.bgyellow='#78350F'; this.textyellow='#FCD34D';
      this.bgpurple='#5B21B6'; this.textpurple='#C4B5FD';
      this.bgpink='#881337'; this.textpink='#F9A8D4';

      this.Logo = 'assets/IconBlanc.svg';
    } else {
      this.text = '#000';
      this.background = '#FFF';
      this.rouge = '#9b0202';

      this.bgblue='#DBEAFE'; this.textblue='#1D4ED8';
      this.bggreen='#D1FAE5'; this.textgreen='#047857';
      this.bgyellow='#FEF3C7'; this.textyellow='#B45309';
      this.bgpurple='#F3E8FF'; this.textpurple='#7C3AED';
      this.bgpink='#FFE4E6'; this.textpink='#BE123C';

      this.Logo = 'assets/IconBlack.svg';
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
