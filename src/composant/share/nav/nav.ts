// nav.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { Icon } from '../icon/icon';

interface NavItem {
  label: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
  badge?: string | number;
  active?: boolean;
  description?: string;
  shortcut?: string;
  footer?: {
    label: string;
    link: string;
  };
  isCenter?: boolean;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon,RouterModule],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav implements OnInit {

  // Rôle de l'utilisateur, par défaut 'invite'
  role: string = 'invite';
  hoveredIndex: number = -1;
  hoveredChild: NavItem | null = null;

  activeMenus = { level1: -1, level2: -1, level3: -1 };
  

  // Menu dynamique
  menu: NavItem[] = [];

  // Index du menu ouvert (pour sous-menus)
  openMenuIndex: number | null = null;

  // Recherche
  searchVisible: boolean = false;
  searchQuery: string = '';
  isDarkMode: string = '';

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 🔹 Récupération du rôle depuis le localStorage
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.role = user.role || 'invite';
      } catch (error) {
        console.error('Erreur parsing localStorage utilisateur :', error);
        this.role = 'invite';
      }
    }

    // 🔹 Génération du menu
    this.generateMenu();
  }

  // 🔹 Génération dynamique du menu avec enfants selon le rôle UniDys
  generateMenu(): void {
    const roleMenu: { [key: string]: NavItem[] } = {

      // ============================================
      // SUPERADMIN - Gestion complète de la plateforme UniDys
      // ============================================
      superadmin: [
        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration globale de la plateforme UniDys',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/users',
              description: 'Gestion des élèves, professeurs, parents et rôles',
            },
            {
              label: 'Cours',
              icon: 'fas fa-book',
              link: '/cours',
              description: 'Gestion des cours, contenus pédagogiques et supports PDF',
            },
            {
              label: 'QCM & Exercices',
              icon: 'fas fa-tasks',
              link: '/qcm',
              description: 'Création et gestion des évaluations interactives',
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/communication',
              description: 'Notifications, emails et annonces globales',
            }
          ]
        },

        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/messagerie',
          description: 'Messages internes entre utilisateurs',
        },

        {
          label: 'Statistiques',
          icon: 'fas fa-chart-line',
          link: '/statistiques',
          description: 'Suivi global des performances des élèves',
        },

        {
          label: 'Contenus pédagogiques',
          icon: 'fas fa-graduation-cap',
          link: '/contenus',
          description: 'Gestion des ressources éducatives et supports adaptés DYS',
        },
      ],

      // ============================================
      // ADMIN - Gestion opérationnelle
      // ============================================
      admin: [
        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Gestion des utilisateurs et contenus pédagogiques',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user',
              link: '/users',
              description: 'Gestion des élèves et professeurs',
            },
            {
              label: 'Cours',
              icon: 'fas fa-book',
              link: '/cours',
              description: 'Création et organisation des cours',
            },
            {
              label: 'QCM',
              icon: 'fas fa-question-circle',
              link: '/qcm',
              description: 'Gestion des évaluations et exercices',
            }
          ]
        },

        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/messagerie',
          description: 'Communication interne',
        },

        {
          label: 'Statistiques',
          icon: 'fas fa-chart-line',
          link: '/statistiques',
          description: 'Analyse des résultats des élèves',
        },
      ],

      // ============================================
      // PROF - Enseignant
      // ============================================
      prof: [
        {
          label: 'Mes cours',
          icon: 'fas fa-book-open',
          link: '/mes-cours',
          description: 'Gérer et consulter tous vos cours et supports PDF',
        },
        {
          label: 'Création',
          icon: 'fas fa-plus-circle',
          link: '/creation',
          description: 'Créer des contenus pédagogiques adaptés (cours, QCM, jeux)',
          children: [
            {
              label: 'Nouveau cours',
              icon: 'fas fa-file-alt',
              link: '/creercours',
              description: 'Créer un cours pédagogique complet avec supports',
            },
            {
              label: 'Créer un QCM',
              icon: 'fas fa-tasks',
              link: '/qcm/create',
              description: 'Créer des évaluations interactives pour les élèves',
            },
            {
              label: 'Créer des jeux éducatifs',
              icon: 'fas fa-gamepad',
              link: '/creerjeux',
              description: 'Générer des jeux pédagogiques assistés par IA',
            }
          ]
        },
        {
          label: 'Élèves',
          icon: 'fas fa-user-graduate',
          link: '/eleves',
          description: 'Suivi des élèves, progression et résultats',
        },
        {
          label: 'Messagerie',
          icon: 'fas fa-comments',
          link: '/messagerie',
          description: 'Échanger avec les élèves et les parents',
        },
      ],

      // ============================================
      // ELEVE - Apprenant
      // ============================================
      eleve: [
        {
          label: 'Apprentissage',
          icon: 'fas fa-graduation-cap',
          link: '/cours',
          description: 'Accès à tous les contenus éducatifs',
          children: [
            {
              label: 'Cours',
              icon: 'fas fa-book-open',
              link: '/cours/liste',
              description: 'Consulter les leçons et supports de cours',
            },
            {
              label: 'Exercices',
              icon: 'fas fa-pen',
              link: '/cours/exercices',
              description: 'S’entraîner avec des exercices interactifs',
            },
            {
              label: 'Jeux',
              icon: 'fas fa-gamepad',
              link: '/cours/jeux',
              description: 'Apprendre en s’amusant avec des jeux éducatifs',
            }
          ],
        },
        {
          label: 'Parcours',
          icon: 'fas fa-route',
          link: '/parcours',
          description: 'Suivre mon apprentissage étape par étape',
        },
        {
          label: 'Classement',
          icon: 'fas fa-trophy',
          link: '/classement',
          description: 'Voir le classement des élèves',
        },
        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/messagerie',
          description: 'Messages avec mes professeurs',
        },
      ],

      // ============================================
      // PARENT - Suivi enfant
      // ============================================
      parent: [
        {
          label: 'Suivi',
          icon: 'fas fa-chart-line',
          link: '/suivi',
          description: 'Suivi des progrès de mon enfant',
        },
        {
          label: 'Cours',
          icon: 'fas fa-book',
          link: '/cours',
          description: 'Accès aux cours suivis',
        },
        {
          label: 'Résultats',
          icon: 'fas fa-chart-bar',
          link: '/resultats',
          description: 'Résultats et évaluations',
        },
        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/messagerie',
          description: 'Communication avec les enseignants',
        },
      ],

      // ============================================
      // INVITE - Accès limité
      // ============================================
      invite: [
        {
          label: 'Présentation',
          icon: 'fas fa-info-circle',
          link: '/presentation',
          description: 'Découvrir la plateforme UniDys',
        },
        {
          label: 'Cours démo',
          icon: 'fas fa-book',
          link: '/demo',
          description: 'Exemples de contenus pédagogiques',
        },
        {
          label: 'Contact',
          icon: 'fas fa-envelope',
          link: '/contact',
          description: 'Nous contacter',
        },
      ]
    };

    // 🔹 Menu final selon rôle (fallback invité)
    this.menu = roleMenu[this.role] || roleMenu['invite'];

    console.log(
      `[UniDys] Menu généré pour le rôle: ${this.role} (${this.menu.length} items)`
    );
  }

  // 🔹 Toggle sous-menu au clic
  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }
  // 🔹 Ouvrir un sous-menu au hover (pour desktop)
  onMouseEnter(index: number): void {
    if (window.innerWidth > 768) {
      this.hoveredIndex = index;
    }
  }

  // 🔹 Fermer le hover
  onMouseLeave(): void {
    this.hoveredIndex = -1;
    this.hoveredChild = null;
  }

  // 🔹 Fermer les menus si on clique en dehors
  @HostListener('document:click', ['$event.target'])
  clickOutside(target: EventTarget | null): void {
    if (!(target instanceof HTMLElement)) return;

    const navEl = document.querySelector('nav');
    if (navEl && !navEl.contains(target)) {
      this.openMenuIndex = null;
      this.searchVisible = false;
    }
  }

  // 🔹 Fonction pour afficher/masquer la barre de recherche
  toggleSearch(): void {
    this.searchVisible = !this.searchVisible;
    if (this.searchVisible) {
      // Focus sur l'input après l'affichage
      setTimeout(() => {
        const searchInput = document.getElementById('nav-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  // 🔹 Recherche dans le menu
  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    // Implémenter la logique de filtrage si nécessaire
    console.log(`[MyAsdam] Recherche: ${query}`);
  }

  // 🔹 Navigation vers un lien
  navigate(link: string | undefined): void {
    if (link) {
      this.router.navigate([link]);
      this.openMenuIndex = null; // Fermer le menu après navigation
    }
  }

  isAnyMenuOpen(): boolean { return this.activeMenus.level1 !== -1 || this.activeMenus.level2 !== -1 || this.activeMenus.level3 !== -1; }
  closeAllMenus(): void { this.activeMenus = { level1: -1, level2: -1, level3: -1 }; }

  toggleLevel1(i: number, event: Event): void {
    event.preventDefault();
    this.activeMenus.level1 = this.activeMenus.level1 === i ? -1 : i;
  }

  toggleLevel2(i: number, event: Event): void {
    event.preventDefault();
    this.activeMenus.level2 = this.activeMenus.level2 === i ? -1 : i;
  }

  toggleLevel3(i: number, event: Event): void {
    event.preventDefault();
    this.activeMenus.level3 = this.activeMenus.level3 === i ? -1 : i;
  }

  onMouseEnterLevel1(i: number): void { this.hoveredIndex = i; }
  onMenuEnter(): void { }
  onMenuLeave(): void { this.activeMenus.level1 = -1; this.activeMenus.level2 = -1; this.activeMenus.level3 = -1; this.hoveredIndex = -1; }


  onMenuClick(item: any, i: number, event: Event) {
    if (item.children) {
      event.preventDefault();
      this.toggleMenu(i);
    }
  }

  onChildClick(link: string): void {
    console.log('NAVIGATE:', link);
    this.router.navigate([link]);
  }
}