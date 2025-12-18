import { Component, HostListener, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../Backend/Services/User/Profil.Service';
import { Icon } from '../icon/icon';

interface MenuItem {
  title: string;
  link: string;
  icon?: string;
  initiales?: string;
}

interface MobileMenu {
  title: string;
  icon?: string;
  link?: string;
  items: MenuItem[];
  initiales?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, AfterViewInit {

  // === VARIABLES DE CLASSE ===
  private _mobileMenuOpen = false;
  activeDropdown: string | null = null;
  connectedUser: any = null;
  unreadMessages = 0;
  mobileMenus: MobileMenu[] = [];
  private scrollPosition = 0;
  isMobileMenuOpen = false;

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

  // Propriétés style
  background = '';
  background2 = '';
  background3 = '';
  text = '';
  rouge = '';
  vert = '';
  vertClair = '';
  vertFonce = '';
  bleu = '';
  bleuFonce = '';
  bleuClair = '';
  bleudark = '';
  Logo = '';



  //
  menuHover = '';
  menuHoverBtn = '';
  itemHover = '';
  hoverBg = '#00d3cf';      // bg hover lien principal
  hoverText = '#FFFFFF';


  @ViewChild('mobileMenu') mobileMenuRef!: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    private userProfileService: ProfileService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.loadUtilisateur();
    this.setThemeColors();
    this.buildMobileMenus(this.role);
  }

  ngAfterViewInit(): void {
    if (this.mobileMenuRef) this.addScrollLock(this.mobileMenuRef.nativeElement);
  }

  // === CHARGER UTILISATEUR ===
  private loadUtilisateur(): void {
    const utilisateurString = localStorage.getItem('utilisateur');
    if (!utilisateurString) return;

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

    // calculer les initiales
    this.initiale = this.getInitiales(this.nom, this.prenom);

    // créer l'objet connectedUser pour le template
    this.connectedUser = {
      nom: this.nom,
      prenom: this.prenom,
      initiales: this.initiale
    };
  }

  // === DÉFINIR COULEURS ET LOGO SELON THÈME ===
  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
      
      // Background sombre avec dégradé et effet visuel
      // this.background = 'linear-gradient(135deg, #020118 0%, #032c36 40%, #026b69 70%, #014342 100%)';
      this.background2 = '#020118'
      this.background3 = '#032c36'
      this.text = '#FFFFFF';
      this.rouge = '#b80000';
      this.bleu = '#00d3cf';
      this.bleudark = '#020118';
      this.Logo = 'assets/LogoBlanc.png';
    } else {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
      
      // Background clair avec dégradé doux
      // this.background = 'linear-gradient(135deg, #ccf9f8 0%, #a0f0eb 50%, #7be6e0 100%)';
      this.background2 = '#ccf9f8'
      this.background3 = '#a0f0eb'
      this.text = '#000000';
      this.rouge = '#9b0202';
      this.bleu = '#029f9d';
      this.Logo = 'assets/LogoBlack.png';
    }
  }


  // === MENUS MOBILE SELON RÔLE ===
  private buildMobileMenus(role: string): void {
    const menus: Record<string, MobileMenu[]> = {
      eleve: [
        {
          title: 'Mes Cours',
          icon: 'fas fa-book-open',
          link: '/cours',
          items: [
            { title: 'Tous les modules', link: '/modules', icon: 'fas fa-th-large' },
            { title: 'Nouveaux cours', link: '/cours/nouveaux', icon: 'fas fa-plus-circle' },
            { title: 'Cours recommandés', link: '/cours/recommandes', icon: 'fas fa-star' },
          ]
        },
        {
          title: 'Mes QCM',
          icon: 'fas fa-clipboard-list',
          link: '/qcm',
          items: [
            { title: 'Tous les QCM', link: '/qcm', icon: 'fas fa-list' },
            { title: 'Nouveaux QCM', link: '/qcm/nouveaux', icon: 'fas fa-plus-circle' },
            { title: 'QCM recommandés', link: '/qcm/recommandes', icon: 'fas fa-star' },
          ]
        },
        {
          title: 'Progrès',
          icon: 'fas fa-chart-line',
          link: '/progress',
          items: [
            { title: 'Mes statistiques', link: '/progress/statistiques', icon: 'fas fa-chart-pie' },
            { title: 'Historique', link: '/progress/historique', icon: 'fas fa-history' },
          ]
        },
        {
          title: 'Classement',
          icon: 'fas fa-medal',
          link: '/classement',
          items: []
        },
        {
          title: 'Contact',
          icon: 'fas fa-envelope',
          link: '/contact',
          items: [
            { title: 'Support', link: '/contact/support', icon: 'fas fa-headset' },
            { title: 'FAQ', link: '/contact/faq', icon: 'fas fa-question-circle' },
          ]
        },
        {
          title: 'Tableau de bord',
          icon: 'fas fa-tachometer-alt',
          link: '/dashboard',
          items: []
        }
      ],
      prof: [
        {
          title: 'Mes cours',
          icon: 'fas fa-chalkboard-teacher',
          link: '/prof/cours',
          items: []
        },
        {
          title: 'Créer un cours',
          icon: 'fas fa-plus-circle',
          link: '/prof/cours/creer',
          items: []
        },
        {
          title: 'Mes QCM',
          icon: 'fas fa-clipboard-list',
          link: '/prof/qcm',
          items: []
        }
      ],
      parent: [
        {
          title: 'Progression de mon enfant',
          icon: 'fas fa-child',
          link: '/parent/progress',
          items: []
        },
        {
          title: 'Messages',
          icon: 'fas fa-envelope',
          link: '/parent/messages',
          items: []
        }
      ],
      admin: [
        {
          title: 'Gestion utilisateurs',
          icon: 'fas fa-users-cog',
          link: '/admin/users',
          items: []
        },
        {
          title: 'Statistiques',
          icon: 'fas fa-chart-bar',
          link: '/admin/stats',
          items: []
        }
      ],
      invité: [
        {
          title: 'Accueil',
          icon: 'fas fa-home',
          link: '/',
          items: []
        },
        {
          title: 'Cours disponibles',
          icon: 'fas fa-book-open',
          link: '/cours',
          items: []
        },
        {
          title: 'Connexion',
          icon: 'fas fa-sign-in-alt',
          link: '/connexion',
          items: []
        }
      ]
    };

    this.mobileMenus = menus[role] || menus['invité'];
  }


  // === GESTION MOBILE MENU ===
  get mobileMenuOpen(): boolean { return this._mobileMenuOpen; }
  set mobileMenuOpen(value: boolean) {
    this._mobileMenuOpen = value;
    if (value) {
      this.scrollPosition = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.classList.remove('menu-open');
      window.scrollTo(0, this.scrollPosition);
    }
  }

  toggleMobileMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }

  // === DROPDOWNS ===
  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeDropdown(id: string): void {
    if (this.activeDropdown === id) this.activeDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('nav')) this.activeDropdown = null;
  }

  // === DÉCONNEXION ===
  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.userProfileService.clearProfile();
    this.router.navigate(['/connexion']);
  }

  // === UTILITAIRES ===
  private getInitiales(nom: string, prenom: string): string {
    const n = nom?.charAt(0) || '';
    const p = prenom?.charAt(0) || '';
    return (p + n).toUpperCase();
  }

  private addScrollLock(menuEl: HTMLElement): void {
    let startY = 0;
    menuEl.addEventListener('touchstart', (e: TouchEvent) => startY = e.touches[0].clientY, { passive: false });
    menuEl.addEventListener('touchmove', (e: TouchEvent) => {
      const scrollTop = menuEl.scrollTop;
      const scrollHeight = menuEl.scrollHeight;
      const offsetHeight = menuEl.offsetHeight;
      const direction = e.touches[0].clientY - startY;
      if ((scrollTop === 0 && direction > 0) || (scrollTop + offsetHeight >= scrollHeight && direction < 0)) e.preventDefault();
    }, { passive: false });
    menuEl.addEventListener('wheel', (e: WheelEvent) => {
      const scrollTop = menuEl.scrollTop;
      const scrollHeight = menuEl.scrollHeight;
      const offsetHeight = menuEl.offsetHeight;
      const delta = e.deltaY;
      if ((scrollTop === 0 && delta < 0) || (scrollTop + offsetHeight >= scrollHeight && delta > 0)) e.preventDefault();
    }, { passive: false });
  }

}
