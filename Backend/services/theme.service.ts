import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkMode.asObservable();

  // Observable public pour que les composants puissent s'abonner
  themeChange$ = this.darkMode.asObservable();

  
  // 🎨 Couleurs globales
  Backgroundprincipal = '';
  Headerprincipal = '';
  Backgroundcards = '';
  Textprincipal = '';
  Textsecondaire = '';
  Border = '';
  Shadow = '';

  // 🎨 Couleurs principales (PRO)
  primary = '';
  primaryHover = '';
  primarySoft = '';

  secondary = '';
  secondaryHover = '';
  secondarySoft = '';

  accent = '';
  accentHover = '';
  accentSoft = '';

  // 🎨 UI
  Bordernormal = '';
  Borderfocus = '';
  Borderhover = '';

  Iconnormal = '';
  Iconhover = '';
  Iconactive = '';

  Fondboutonprincipal = '';
  Fondboutonsecondaire = '';

  Cardhover = '';
  Sidebarlienhover = '';

  ThemeImage: string = '';
  ImageDos: string = '';
  BackgroundImage: string = '';

  BgOui: string = '';
  BgNon: string = '';
  BorderOui: string = '';
  BorderNon: string = '';
  BgBleu: string = '';
  BorderBleu: string = '';
  BgBleuText: string = '';
  BgNonText: string = '';
  BgOuiText: string = '';

  constructor() {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const newMode = !this.darkMode.value;
    this.darkMode.next(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
  }

  applyTheme(isDark: boolean) {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    this.setThemeColors(isDark);
  }

  // 🎯 Couleurs selon thème
  setThemeColors(isDark: boolean): void {

    if (isDark) {

      // 🌙 DARK MODE
      this.Backgroundprincipal = '#020118';
      this.Backgroundcards = '#080630';
      this.ThemeImage = 'assets/IconBlanc.svg';
      this.ImageDos = 'assets/CartesDosBlack.png';

      this.Textprincipal = '#E0E6E9';
      this.Textsecondaire = '#A0B0B8';

      this.Shadow = 'inset 0 2px 4px rgba(240,250,255,0.7), 0 4px 6px rgba(0,0,0,0.2)';

      // 🟢 PRIMARY
      this.primary = '#7C3AED';
      this.primaryHover = '#6D28D9';
      this.primarySoft = '#EDE9FE';

      // 🔵 SECONDARY
      this.secondary = '#2563EB';
      this.secondaryHover = '#1D4ED8';
      this.secondarySoft = '#DBEAFE';

      // ICONS
      this.Iconnormal = '#FFFFFF';
      this.Iconhover = this.secondary;
      this.Iconactive = this.primary;

      this.BgOui      = '#14532d'; // vert foncé
      this.BorderOui  = '#22c55e'; // vert vif
      this.BgOuiText  = '#ffffff'; // blanc (lisible sur vert foncé)

      this.BgNon      = '#7f1d1d'; // rouge foncé
      this.BgNonText  = '#ffffff'; // blanc (lisible sur rouge foncé)
      this.BorderNon  = '#ef4444'; // rouge vif

      this.BgBleu     = '#1e3a8a'; // bleu foncé (corrigé)
      this.BgBleuText = '#ffffff'; // blanc (lisible sur bleu foncé)
      this.BorderBleu = '#3b82f6'; // bleu vif (corrigé)

      // UI
      this.Bordernormal = '1px solid #E5E7EB';
      this.Borderfocus = `1px solid ${this.secondary}`;
      this.Borderhover = '1px solid #3A3F45';

      this.Fondboutonprincipal = this.primary;
      this.Fondboutonsecondaire = this.secondarySoft;

      this.Cardhover = '#242A2E';
      this.Sidebarlienhover = this.primarySoft;

    } else {

      // ☀️ LIGHT MODE
      this.Backgroundprincipal = '#FFFFFF';
      this.Backgroundcards = '#fcfbfb';
      this.ThemeImage = 'assets/IconBlack.svg';
      this.ImageDos = 'assets/CartesDosBlanc.png';

      this.Textprincipal = '#1A1A1A';
      this.Textsecondaire = '#555E66';

      this.Shadow = 'inset 0 2px 4px rgba(18,22,25,0.7), 0 4px 6px rgba(0,0,0,0.1)';

      // 🟢 PRIMARY
      this.primary = '#7C3AED';
      this.primaryHover = '#6D28D9';
      this.primarySoft = '#EDE9FE';

      // 🔵 SECONDARY
      this.secondary = '#2563EB';
      this.secondaryHover = '#1D4ED8';
      this.secondarySoft = '#DBEAFE';

      // ICONS
      this.Iconnormal = '#000000';
      this.Iconhover = this.secondary;
      this.Iconactive = this.primary;

      // 🔵 Validation Convo
      this.BgOui      = '#dcfce7';     // vert très clair
      this.BgNon      = '#fee2e2';     // rouge très clair
      this.BorderOui  = '#22c55e';     // vert vif
      this.BorderNon  = '#ef4444';     // rouge vif

      this.BgOuiText  = '#14532d';     // vert foncé (lisible sur vert très clair)
      this.BgNonText  = '#7f1d1d';     // rouge foncé (lisible sur rouge très clair)

      this.BgBleu     = '#dbeafe';     // bleu très clair (cohérent avec les autres)
      this.BgBleuText = '#1e3a8a';     // bleu foncé (lisible sur bleu très clair)
      this.BorderBleu = '#3b82f6';     // bleu vif


      // UI
      this.Bordernormal = '1px solid #2C2F33';
      this.Borderfocus = `1px solid ${this.secondary}`;
      this.Borderhover = '1px solid #D1D5DB';

      this.Fondboutonprincipal = this.primary;
      this.Fondboutonsecondaire = this.primarySoft;

      this.Cardhover = '#F3F6F9';
      this.Sidebarlienhover = this.primarySoft;
    }
  }

  get isDarkMode() {
    return this.darkMode.value;
  }
}