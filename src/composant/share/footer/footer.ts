import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';
import { ThemeService } from '../../../../Backend/services/theme.service';

interface NavItem {
  title: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink,Icon],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer implements OnInit {

  currentYear = new Date().getFullYear();
  isDarkMode = false;

  hoverIndex: number | null = null;
  hoverNavIndex: number | null = null;

  // Données utilisateur
  cours: any[] = [];
  dysListe: any[] = [];
  eleveKey: string = '';
  eleveRelations: any[] = [];
  email: string = '';
  font: string = '';
  initiale: string = '';
  luminosite: number = 100;
  nom: string = '';
  photoProfil: string = '';
  prenom: string = '';
  qcm: any[] = [];
  theme: string = 'clair';
  xp: number = 0;
  role: string = '';

 

  navLinks: NavItem[] = [];
  ressources: NavItem[] = [];

  socialIcons = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'fa-brands fa-facebook-f' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'fa-brands fa-instagram' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'fa-brands fa-twitter' }
  ];

  private navByRole: Record<string, { navLinks: NavItem[]; ressources: NavItem[] }> = {
    eleve: {
      navLinks: [
        { title: 'Modules', link: '/modules', icon: 'fas fa-book-open' },
        { title: 'Nouveaux cours', link: '/cours/nouveaux', icon: 'fas fa-plus-circle' },
        { title: 'Cours recommandés', link: '/cours/recommandes', icon: 'fas fa-star' },
        { title: 'Progression', link: '/apprentissage/progression', icon: 'fas fa-chart-line' },
        { title: 'Matières', link: '/apprentissage/matieres', icon: 'fas fa-book' }
      ],
      ressources: [
        { title: 'Jeux éducatifs', link: '/jeux/educatifs', icon: 'fas fa-puzzle-piece' },
        { title: 'Défis du jour', link: '/jeux/defis', icon: 'fas fa-trophy' },
        { title: 'Classements', link: '/jeux/classements', icon: 'fas fa-medal' },
        { title: 'Support', link: '/contact/support', icon: 'fas fa-headset' },
        { title: 'FAQ', link: '/contact/faq', icon: 'fas fa-question-circle' }
      ]
    },
    parent: {
      navLinks: [
        { title: 'Modules', link: '/modules', icon: 'fas fa-book-open' },
        { title: 'Nouveaux cours', link: '/cours/nouveaux', icon: 'fas fa-plus-circle' },
        { title: 'Cours recommandés', link: '/cours/recommandes', icon: 'fas fa-star' },
        { title: 'Progression', link: '/apprentissage/progression', icon: 'fas fa-chart-line' },
        { title: 'Matières', link: '/apprentissage/matieres', icon: 'fas fa-book' }
      ],
      ressources: [
        { title: 'Jeux éducatifs', link: '/jeux/educatifs', icon: 'fas fa-puzzle-piece' },
        { title: 'Défis du jour', link: '/jeux/defis', icon: 'fas fa-trophy' },
        { title: 'Classements', link: '/jeux/classements', icon: 'fas fa-medal' },
        { title: 'Support', link: '/contact/support', icon: 'fas fa-headset' },
        { title: 'FAQ', link: '/contact/faq', icon: 'fas fa-question-circle' }
      ]
    },
    prof: {
      navLinks: [
        { title: 'Modules', link: '/modules', icon: 'fas fa-book-open' },
        { title: 'Nouveaux cours', link: '/cours/nouveaux', icon: 'fas fa-plus-circle' },
        { title: 'Cours recommandés', link: '/cours/recommandes', icon: 'fas fa-star' },
        { title: 'Progression', link: '/apprentissage/progression', icon: 'fas fa-chart-line' },
        { title: 'Matières', link: '/apprentissage/matieres', icon: 'fas fa-book' }
      ],
      ressources: [
        { title: 'Jeux éducatifs', link: '/jeux/educatifs', icon: 'fas fa-puzzle-piece' },
        { title: 'Défis du jour', link: '/jeux/defis', icon: 'fas fa-trophy' },
        { title: 'Classements', link: '/jeux/classements', icon: 'fas fa-medal' },
        { title: 'Support', link: '/contact/support', icon: 'fas fa-headset' },
        { title: 'FAQ', link: '/contact/faq', icon: 'fas fa-question-circle' }
      ]
    },
    admin: {
      navLinks: [
        { title: 'Modules', link: '/modules', icon: 'fas fa-book-open' },
        { title: 'Nouveaux cours', link: '/cours/nouveaux', icon: 'fas fa-plus-circle' },
        { title: 'Cours recommandés', link: '/cours/recommandes', icon: 'fas fa-star' },
        { title: 'Progression', link: '/apprentissage/progression', icon: 'fas fa-chart-line' },
        { title: 'Matières', link: '/apprentissage/matieres', icon: 'fas fa-book' }
      ],
      ressources: [
        { title: 'Jeux éducatifs', link: '/jeux/educatifs', icon: 'fas fa-puzzle-piece' },
        { title: 'Défis du jour', link: '/jeux/defis', icon: 'fas fa-trophy' },
        { title: 'Classements', link: '/jeux/classements', icon: 'fas fa-medal' },
        { title: 'Support', link: '/contact/support', icon: 'fas fa-headset' },
        { title: 'FAQ', link: '/contact/faq', icon: 'fas fa-question-circle' }
      ]
    }
  };

  constructor(private renderer: Renderer2,
     public themeService:ThemeService
  ) {}

  ngOnInit(): void {
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);
      ({
        cours: this.cours,
        dysListe: this.dysListe,
        eleveKey: this.eleveKey,
        eleveRelations: this.eleveRelations,
        email: this.email,
        font: this.font,
        initiale: this.initiale,
        luminosite: this.luminosite,
        nom: this.nom,
        photoProfil: this.photoProfil,
        prenom: this.prenom,
        qcm: this.qcm,
        role: this.role,
        theme: this.theme,
        xp: this.xp
      } = utilisateur);

      // Charger la navigation et ressources selon le rôle
      if (this.navByRole[this.role]) {
        this.navLinks = this.navByRole[this.role].navLinks;
        this.ressources = this.navByRole[this.role].ressources;
      }
    }
  }

}
