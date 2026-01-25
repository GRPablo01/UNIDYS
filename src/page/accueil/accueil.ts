import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from '../../composant/header/header';
import { Welcome } from '../../composant/Page-Accueil/welcome/welcome';
import { Histoire } from "../../composant/Page-Accueil/histoire/histoire";
import { Comment } from '../../composant/Page-Accueil/comment/comment';
import { Profil } from "../../composant/dossier-Header/profil/profil";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, Header, Welcome, Histoire, Comment, Profil],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css']
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

  // 🎨 Couleurs du thème
  rouge!: string;
  bleu!: string;
  rose!: string;
  orange!: string;
  background2!: string;
  Image!: string;
  text!:string;

  constructor(
    private titleService: Title,
    private renderer: Renderer2
  ) {}

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

      this.luminosite = Number(this.luminosite ?? 100);
    }

    // 🎨 Appliquer thème + couleurs + luminosité
    this.setThemeColors();
    this.appliquerTheme();
    this.updateScrollbarColors();

    // ⏳ Petit effet de chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

  // ────────────────────────────────────────────
  // DÉFINITION DES COULEURS SELON LE THÈME
  // ────────────────────────────────────────────
  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.text = '#FFF';
      this.background = '#261466';
      this.background2 = '#1C0F4B99';
      this.rouge = '#b80000';
      this.bleu = '#4533FD';
      this.rose = '#F729FE';
      this.orange = '#FE8218';
      this.Image = 'assets/decorwelcomedark.png';
    } else {
      this.text = '#000';
      this.background = '#FFF';
      this.background2 = '#ffffffaa';
      this.rouge = '#9b0202';
      this.bleu = '#1101B6';
      this.rose = '#A902AF';
      this.orange = '#CF6103';
      this.Image = 'assets/decorwelcomeclair.png';
    }
  }

  // ────────────────────────────────────────────
  // THÈME CLAIR / SOMBRE + LUMINOSITÉ UTILISATEUR
  // ────────────────────────────────────────────
  appliquerTheme(): void {
    const brightnessValue = this.luminosite / 100;

    if (this.theme === 'sombre') {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
    }

    // ✅ Luminosité utilisateur
    this.renderer.setStyle(document.body, 'filter', `brightness(${brightnessValue})`);
  }

  // ────────────────────────────────────────────
  // SCROLLBAR DYNAMIQUE SELON THÈME
  // ────────────────────────────────────────────
  updateScrollbarColors(): void {
    const root = document.documentElement;

    if (this.theme === 'sombre') {
      root.style.setProperty('--scroll-track', this.background2);
      root.style.setProperty('--scroll-thumb', this.bleu);
      root.style.setProperty('--scroll-thumb-hover', this.rose);
    } else {
      root.style.setProperty('--scroll-track', this.background2);
      root.style.setProperty('--scroll-thumb', this.bleu);
      root.style.setProperty('--scroll-thumb-hover', this.rose);
    }
  }
}
