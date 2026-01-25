import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../icon/icon';

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-histoire',
  standalone: true,
  imports: [CommonModule,Icon],
  templateUrl: './histoire.html',
  styleUrls: ['./histoire.css'],
})
export class Histoire implements OnInit {

  nom: string = '';
  prenom: string = '';
  initiales: string = '';

  theme: 'clair' | 'sombre' = 'clair';
  text = '';
  texte = '';
  titre = '';
  header = '';
  rouge = '';
  background = '';
  background2 = '';
  Image = '';
  isMobile = false;
  Logo ='';
  Forme ='';


  hoverBtn: boolean = false;
// Bleuclair: string = '#B3E0F2';
// Orangeclair: string = '#D9965B';

  Bleuclair: string = '';
  Orangeclair: string = '';
  Or: string = '';
  Maron: string = '';
  RougeFonce: string = '';
  

  bleu: string = '';
  rose: string = '';
  orange: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
  }

  // 📱 Détection mobile responsive
  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  /**
   * 🔹 Charger l'utilisateur depuis le localStorage
   */
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      try {
        const user: Utilisateur = JSON.parse(storedUser);
        this.nom = user.nom || '';
        this.prenom = user.prenom || '';
        this.initiales = this.getInitiales(this.nom, this.prenom);

        // thème
        this.theme =
          user.theme === 'sombre' || user.theme === 'clair'
            ? user.theme
            : 'clair';

      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
        this.theme = 'clair';
      }
    }

    this.setThemeColors();
  }

  // 🔤 Initiales
  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

    /**
 * Définit les couleurs selon le thème
 */
private setThemeColors(): void {

  if (this.theme === 'sombre') {

    // ===== TEXTE =====
    this.text = '#FFFFFF';          // texte principal
    this.texte = '#E6F2EE';         // texte courant (plus doux)
    this.titre = '#FFFFFF';         // titres

    // ===== STRUCTURE =====
    this.background = '#0E2F26';    // fond principal
    this.header = '#044629';        // header

    // ===== ACCENTS =====
    this.rouge = '#b80000';

    this.Bleuclair = '#4A6C7A';
    this.Orangeclair = '#B5723C';
    this.Or = '#A57C36';
    this.RougeFonce = '#A03B2B';
    this.Maron = '#7A2E17';

    // ===== LOGO =====
    this.Logo = 'assets/IconBlanc.svg';
    this.Forme = 'assets/formeclair.png';

  } else {

    // ===== TEXTE =====
    this.text = '#000000';          // texte principal
    this.texte = '#044629';         // texte courant
    this.titre = '#044629';         // titres

    // ===== STRUCTURE =====
    this.background = '#F6F7F8';    // fond principal
    this.header = '#B3E0F2';        // header

    // ===== ACCENTS =====
    this.rouge = '#9b0202';

    this.Bleuclair = '#B3E0F2';
    this.Orangeclair = '#D9965B';
    this.Or = '#D9AD5B';
    this.RougeFonce = '#592B1B';
    this.Maron = '#CD5320';

    // ===== LOGO =====
    this.Logo = 'assets/IconBlack.svg';
    this.Forme = 'assets/formeclair.png';
  }
}
  // Navigation
  commencerApprentissage(): void {
    this.router.navigate(['/apprentissage']);
  }
}
