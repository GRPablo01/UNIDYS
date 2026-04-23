import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Header } from "../../../composant/public/header/header";
import { FormsModule } from '@angular/forms';
import { Footer } from "../../../composant/share/footer/footer";
import { Mobile } from '../../../composant/share/mobile/mobile';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { CreerCours2 } from '../../../composant/share/page-CREERCOURS/creer-cours2/creer-cours2';




@Component({
  selector: 'app-creer-cours',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Footer,
    Mobile,
    CreerCours2,
  ],
  templateUrl: './creer-cours.html',
  styleUrls: ['./creer-cours.css'],
})
export class CreerCours implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;
  particles = Array(20);

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre de la page
    this.titleService.setTitle('UNIDYS | Créer un Cours');

    // 👤 Vérification de la connexion utilisateur
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) this.isLoggedIn = true;

    // 🎨 Appliquer le thème depuis le ThemeService (lecture localStorage)
    this.themeService.applyTheme(this.themeService.isDarkMode);

    // 🎯 Initialisation de la scrollbar
    this.initScrollbar();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  /**
   * 🎯 Initialise la scrollbar dynamique et écoute les changements de thème
   */
  private initScrollbar(): void {
    // Couleurs initiales
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // Abonnement aux changements de thème
    this.themeService.themeChange$.subscribe(isDark => {
      this.updateScrollbarColors(isDark);
    });
  }

  /**
   * 🎨 Met à jour les couleurs de la scrollbar
   */
  private updateScrollbarColors(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--scroll-track', '#020118');
      root.style.setProperty('--scroll-thumb', '#7C3AED');
      root.style.setProperty('--scroll-thumb-hover', '#2563EB');
    } else {
      root.style.setProperty('--scroll-track', '#FFFFFF');
      root.style.setProperty('--scroll-thumb', '#2563EB');
      root.style.setProperty('--scroll-thumb-hover', '#7C3AED');
    }
  }
}