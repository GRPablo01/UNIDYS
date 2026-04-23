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

  // 🎯 Couleurs selon thème (version alignée avec ton image)
  setThemeColors(isDark: boolean): void {

    if (isDark) {

      // 🌙 DARK MODE
      this.Backgroundprincipal = '#0B0F3A';
      this.Backgroundcards = '#11154D';
      this.ThemeImage = 'assets/IconBlanc.svg';

      this.Textprincipal = '#E6EDF3';
      this.Textsecondaire = '#A0AEC0';

      this.Shadow = 'inset 0 2px 4px rgba(255,255,255,0.05), 0 4px 10px rgba(0,0,0,0.4)';

      // 🔥 PRIMARY (orange corail)
      this.primary = '#FF5A3C';
      this.primaryHover = '#E14A2E';
      this.primarySoft = '#FFE5E0';

      // 🌿 SECONDARY (vert)
      this.secondary = '#1FBF8F';
      this.secondaryHover = '#159A72';
      this.secondarySoft = '#D1FAE5';

      // ⭐ ACCENT (jaune)
      this.accent = '#F2C94C';

      // ICONS
      this.Iconnormal = '#FFFFFF';
      this.Iconhover = this.secondary;
      this.Iconactive = this.primary;

      // ✅ OUI (vert)
      this.BgOui      = '#064E3B';
      this.BorderOui  = '#1FBF8F';
      this.BgOuiText  = '#ECFDF5';

      // ❌ NON (orange/rouge)
      this.BgNon      = '#7C2D12';
      this.BgNonText  = '#FFF7ED';
      this.BorderNon  = '#FF5A3C';

      // 🔵 INFO (bleu cohérent avec fond)
      this.BgBleu     = '#1E3A8A';
      this.BgBleuText = '#DBEAFE';
      this.BorderBleu = '#3B82F6';

      // UI
      this.Bordernormal = '1px solid rgba(255,255,255,0.08)';
      this.Borderfocus = `1px solid ${this.secondary}`;
      this.Borderhover = '1px solid rgba(255,255,255,0.2)';

      this.Fondboutonprincipal = this.primary;
      this.Fondboutonsecondaire = this.secondarySoft;

      this.Cardhover = '#1A1F5C';
      this.Sidebarlienhover = this.primarySoft;

    } else {

      // ☀️ LIGHT MODE
      this.Backgroundprincipal = '#FFFFFF';
      this.Backgroundcards = '#F8FAFC';
      this.ThemeImage = 'assets/IconBlack.svg';

      this.Textprincipal = '#1A1A1A';
      this.Textsecondaire = '#5B6570';

      this.Shadow = 'inset 0 2px 4px rgba(0,0,0,0.04), 0 4px 6px rgba(0,0,0,0.08)';

      // 🔥 PRIMARY (orange)
      this.primary = '#FF5A3C';
      this.primaryHover = '#E14A2E';
      this.primarySoft = '#FFE5E0';

      // 🌿 SECONDARY (vert)
      this.secondary = '#1FBF8F';
      this.secondaryHover = '#159A72';
      this.secondarySoft = '#D1FAE5';

      // ⭐ ACCENT
      this.accent = '#F2C94C';

      // ICONS
      this.Iconnormal = '#1A1A1A';
      this.Iconhover = this.secondary;
      this.Iconactive = this.primary;

      // ✅ OUI
      this.BgOui      = '#D1FAE5';
      this.BorderOui  = '#1FBF8F';
      this.BgOuiText  = '#064E3B';

      // ❌ NON
      this.BgNon      = '#FFE5E0';
      this.BorderNon  = '#FF5A3C';
      this.BgNonText  = '#7C2D12';

      // 🔵 INFO
      this.BgBleu     = '#DBEAFE';
      this.BgBleuText = '#1E3A8A';
      this.BorderBleu = '#3B82F6';

      // UI
      this.Bordernormal = '1px solid #E2E8F0';
      this.Borderfocus = `1px solid ${this.secondary}`;
      this.Borderhover = '1px solid #CBD5E1';

      this.Fondboutonprincipal = this.primary;
      this.Fondboutonsecondaire = this.primarySoft;

      this.Cardhover = '#F1F5F9';
      this.Sidebarlienhover = this.primarySoft;
    }
  }

  get isDarkMode() {
    return this.darkMode.value;
  }
}