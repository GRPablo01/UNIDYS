import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../../header/header';

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule,Header],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'],
})
export class Welcome implements OnInit {

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

      this.Header = '#020617';
      this.Header2 = '#0F172A';
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


  // Navigation
  commencerApprentissage(): void {
    this.router.navigate(['/apprentissage']);
  }
}
