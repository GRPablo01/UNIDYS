import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from '../../composant/header/header';
import { Welcome } from '../../composant/header/Page-Accueil/welcome/welcome';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, Header,Welcome],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil implements OnInit {

  // ✅ Variable pour simuler le chargement
  isLoaded: boolean = false;

  // ────────────────────────────────────────────
  // VARIABLES THÈME & UTILISATEUR
  // ────────────────────────────────────────────
  background: string = '';

  cours: any[] = [];
  dysListe: any[] = [];
  Key: string = '';
  eleveRelations: any[] = [];
  email: string = '';
  font: string = '';
  initiale: string = '';
  luminosite: number = 100;
  nom: string = '';
  avatar: string = '';
  prenom: string = '';
  qcm: any[] = [];
  theme: 'clair' | 'sombre' = 'sombre';
  xp: number = 0;
  role: string = '';
  cookie: string = '';

  constructor(
    private titleService: Title,
    private renderer: Renderer2
  ) {}

  // ────────────────────────────────────────────
  // INITIALISATION
  // ────────────────────────────────────────────
  ngOnInit(): void {

    // 🧠 Titre onglet
    this.titleService.setTitle('UniDys | Accueil');

    // 🔐 Récupération utilisateur connecté
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);

      ({
        cours: this.cours,
        dysListe: this.dysListe,
        Key: this.Key,
        eleveRelations: this.eleveRelations,
        email: this.email,
        font: this.font,
        initiale: this.initiale,
        luminosite: this.luminosite,
        nom: this.nom,
        photoProfil: this.avatar,
        prenom: this.prenom,
        qcm: this.qcm,
        role: this.role,
        theme: this.theme,
        xp: this.xp,
        cookie: this.cookie
      } = utilisateur);

      // ✅ Sécurisation luminosité (string → number)
      this.luminosite = Number(this.luminosite ?? 100);
    }

    // 🎨 Appliquer thème + luminosité
    this.appliquerTheme();

    // ⏳ Petit effet de chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

  // ────────────────────────────────────────────
  // THÈME CLAIR / SOMBRE + LUMINOSITÉ UTILISATEUR
  // ────────────────────────────────────────────
  appliquerTheme(): void {

    const brightnessValue = this.luminosite / 100;

    if (this.theme === 'sombre') {

      this.renderer.setAttribute(
        document.documentElement,
        'data-theme',
        'dark'
      );

      // 🌑 Background sombre
      this.background = '#001219';

    } else {

      this.renderer.removeAttribute(
        document.documentElement,
        'data-theme'
      );

      // 🌤️ Background clair
      this.background =
        '#FFFFFF';
    }

    // ✅ Luminosité utilisateur (CORRIGÉ)
    this.renderer.setStyle(
      document.body,
      'filter',
      `brightness(${brightnessValue})`
    );
  }
}
