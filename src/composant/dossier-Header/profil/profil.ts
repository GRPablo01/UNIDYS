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
  bleu: string = '';
  rose: string = '';
  orange: string = '';

  hoverUser: boolean = false;

  constructor(
    private router: Router
  ) {}


  ngOnInit() {
    this.loadUtilisateur();
    this.setThemeColors();
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

  // Applique les couleurs du thème
  private setThemeColors(): void {
    if (this.theme === 'sombre') {

      this.text = '#FFF';
      this.background = '#261466';
      this.rouge = '#b80000';

      this.bleu = '#4533FD';
      this.rose = '#F729FE';
      this.orange = '#FE8218';

      this.Logo = 'assets/IconBlanc.svg';

    } else {

      this.text = '#000';
      this.background = '#FFF';
      this.rouge = '#9b0202';

      this.bleu = '#1101B6';
      this.rose = '#A902AF';
      this.orange = '#CF6103';

      this.Logo = 'assets/IconBlack.svg';
    }
  }

  menuOpen = false;

openMenu() {
  this.menuOpen = true;
}

keepMenuOpen() {
  this.menuOpen = true;
}

closeMenu() {
  this.menuOpen = false;
}

deconnecter(): void {
  localStorage.clear();
  sessionStorage.clear();
  this.router.navigate(['/connexion']);
}

}
