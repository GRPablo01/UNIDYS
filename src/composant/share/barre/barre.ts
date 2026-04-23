// barre.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { XpBarre } from '../xp-barre/xp-barre';
import { DysBarre } from '../dys-barre/dys-barre';
import { Relationbarre } from '../relation-barre/relation-barre';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-barre',
  standalone: true,
  imports: [CommonModule, XpBarre, DysBarre, Relationbarre, Icon],
  templateUrl: './barre.html',
  styleUrls: ['./barre.css']
})
export class Barre implements OnInit {

  // ===============================
  // Variables utilisateur
  // ===============================
  role: string = '';
  nom: string = '';
  prenom: string = '';
  email: string = '';
  photoProfil: string = '';
  initiale: string = '';
  theme: string = '';
  xp: number = 0;
  notifications: any[] = [];
  dysListe: any[] = [];
  cours: any[] = [];
  qcm: any[] = [];
  font: string = '';
  luminosite: number = 100;

  // ✅ Variable pour le responsive
  showBars: boolean = true;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.checkScreenWidth(); // Vérifie la largeur au démarrage

    const utilisateur = localStorage.getItem('utilisateur');
    if (utilisateur) {
      const user = JSON.parse(utilisateur);

      // Remplissage des variables
      this.role = user.role || '';
      this.nom = user.nom || '';
      this.prenom = user.prenom || '';
      this.email = user.email || '';
      this.photoProfil = user.photoProfil || '';
      this.initiale = user.initiale || '';
      this.theme = user.theme || '';
      this.xp = user.xp || 0;
      this.notifications = user.notifications || [];
      this.dysListe = user.dysListe || [];
      this.cours = user.cours || [];
      this.qcm = user.qcm || [];
      this.font = user.font || 'Roboto';
      this.luminosite = user.luminosite || 100;

      // ✅ Appel des méthodes avec argument user
      this.initByRole(user);
    }
  }

  // ===============================
  // Détection du redimensionnement pour responsive
  // ===============================
  @HostListener('window:resize')
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    const width = window.innerWidth;
    // Si largeur entre 600px et 932px => on cache
    this.showBars = !(width >= 600 && width <= 932);
  }

  // ===============================
  // Initialisation par rôle
  // ===============================
  private initByRole(user: any) {
    switch(user.role) {
      case 'eleve': this.initEleve(user); break;
      case 'prof': this.initProf(user); break;
      case 'parent': this.initParent(user); break;
      default: console.warn('Rôle inconnu :', user.role);
    }
  }

  private initEleve(user: any) {
    this.cours = user.cours || [];
    this.qcm = user.qcm || [];
    this.dysListe = user.dysListe || [];
    this.xp = user.xp || 0;
  }

  private initProf(user: any) {
    this.cours = user.cours || [];
    this.notifications = user.notifications || [];
  }

  private initParent(user: any) {
    this.dysListe = user.eleveRelations || [];
    this.notifications = user.notifications || [];
  }
}