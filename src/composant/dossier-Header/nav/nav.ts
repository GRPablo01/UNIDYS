import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Utilisateur {
  role: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
  imports: [CommonModule, RouterLink],
})
export class Nav implements OnInit {
  utilisateur!: Utilisateur | null;
  menuOpen: boolean = false;

  navLinks: { label: string; path: string }[] = [];

  // Gestion du thème
  theme: 'clair' | 'sombre' = 'clair';
  text!: string;
  background!: string;
  rouge!: string;
  Logo!: string;
  Forme = '';

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


  // Responsive
  isMobile: boolean = false;
  isCompactMobile: boolean = false;

  hoverIndex: number = -1;

  ngOnInit() {
    console.log('Initialisation de NAV...');

    // 🔹 Récupération sécurisée de l'utilisateur depuis localStorage
    this.loadUserInfo();

    // 🔹 Vérification initiale de la taille de l'écran
    this.updateScreenSize();
  }

  // 🔹 Détecter le redimensionnement de la fenêtre
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenSize();
  }

  /**
   * 🔹 Charger les infos utilisateur (role + thème)
   */
  private loadUserInfo() {
    const storedUser = localStorage.getItem('utilisateur'); // clé uniforme "user"
    if (!storedUser) {
      console.log('Aucun utilisateur trouvé dans le localStorage');
      this.utilisateur = null;
      this.navLinks = [{ label: 'Accueil', path: '/accueil' }];
      this.theme = 'clair';
      this.setThemeColors();
      return;
    }

    try {
      const userObj: Utilisateur = JSON.parse(storedUser);
      this.utilisateur = userObj;

      // 🔹 Récupération du thème
      if (userObj.theme === 'clair' || userObj.theme === 'sombre') {
        this.theme = userObj.theme;
      } else {
        this.theme = 'clair';
      }

      console.log('Utilisateur récupéré :', userObj);

      // 🔹 Charger la navigation selon le rôle
      this.chargerNavigation(userObj.role);

    } catch (error) {
      console.error('Erreur parsing utilisateur depuis localStorage :', error);
      this.utilisateur = null;
      this.navLinks = [{ label: 'Accueil', path: '/accueil' }];
      this.theme = 'clair';
    }

    // 🔹 Appliquer les couleurs selon le thème
    this.setThemeColors();
  }

  // 🔹 Définir les liens selon le rôle
  chargerNavigation(role: string) {
    switch (role) {
      case 'prof':
        this.navLinks = [
          { label: 'Cours', path: '/accueil' },
          { label: 'Exercice', path: '/mescours' },
          { label: 'Parcours', path: '/qcm' },
        ];
        break;
      case 'eleve':
        this.navLinks = [
          { label: 'Cours', path: '/cours' },
          { label: 'Exercice', path: '/exercice' },
          { label: 'Parcours', path: '/parcours' },
          { label: 'Info', path: '/info' },
          { label: 'Contact', path: '/contact' },
        ];
        break;
      case 'admin':
        this.navLinks = [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Utilisateurs', path: '/utilisateurs' },
          { label: 'Cours', path: '/cours' },
        ];
        break;
      default:
        this.navLinks = [{ label: 'Accueil', path: '/accueil' }];
        break;
    }
    console.log('Liens de navigation générés :', this.navLinks);
  }

  // 🔹 Définir les couleurs selon le thème
  private setThemeColors(): void {
    if (this.theme === 'sombre') {

      this.Header = '#020617';
      this.Header2 = '#344076';
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

  // 🔹 Changer le thème et mettre à jour localStorage
  toggleTheme() {
    this.theme = this.theme === 'clair' ? 'sombre' : 'clair';
    this.setThemeColors();
    this.updateUserLocalStorage();
    console.log('Thème après toggle :', this.theme);
  }

  // 🔹 Mise à jour du thème dans le localStorage
  private updateUserLocalStorage() {
    if (!this.utilisateur) return;

    try {
      const userCopy = { ...this.utilisateur, theme: this.theme };
      localStorage.setItem('user', JSON.stringify(userCopy));
    } catch (error) {
      console.error('Erreur mise à jour thème dans localStorage :', error);
    }
  }

  // 🔹 Ouvrir / fermer le menu mobile
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // 🔹 Définir les flags responsive
  updateScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 989;
    this.isCompactMobile = width < 905;
  }

  // 🔹 Hover sur un lien
  onHover(index: number, etat: boolean) {
    this.hoverIndex = etat ? index : -1;
  }
}
