import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-histoire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './histoire.html',
  styleUrls: ['./histoire.css'],
})
export class Histoire implements OnInit {

  nom: string = '';
  prenom: string = '';
  initiales: string = '';

  theme: 'clair' | 'sombre' = 'clair';
  text = '';
  rouge = '';
  background = '';
  background2 = '';
  Image = '';
  isMobile = false;

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

  // 🎨 Définir les couleurs selon le thème
  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.text = '#FFF';
      this.background = '#261466';
      this.background2 = '#1C0F4B99';
      this.rouge = '#b80000';
      this.bleu = '#4533FD';
      this.rose = '#F729FE';
      this.orange = '#FE8218';
      this.Image = 'assets/decorhistoiredark.png';
    } else {
      this.text = '#000';
      this.background = '#FFF';
      this.background2 = '#ffffffaa';
      this.rouge = '#9b0202';
      this.bleu = '#1101B6';
      this.rose = '#A902AF';
      this.orange = '#CF6103';
      this.Image = 'assets/decorhistoireclair.png';
    }
  }

  // Navigation
  commencerApprentissage(): void {
    this.router.navigate(['/apprentissage']);
  }
}
