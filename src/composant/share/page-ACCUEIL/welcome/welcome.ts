import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../../Backend/services/theme.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface Feature {
  icon: string;
  title: string;
  desc: string;
  link: string;
  gradient: string;
}

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  text: string;
  avatarColor: string;
}

interface Notification {
  text: string;
  time: string;
  color: string;
  read: boolean;
}

interface Activity {
  initials: string;
  color: string;
  text: string;
  time: string;
}

interface WeatherDay {
  name: string;
  icon: string;
  temp: number;
}

interface Task {
  text: string;
  done: boolean;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class Welcome implements OnInit, OnDestroy {
  
  // État UI
  isLoading = false;
  animationStarted = false;
  highContrastMode = false;
  showParticles = true;
  baseFontSize = '100%';
  fontSizeLevel = 2;
  
  // Sidebars
  leftSidebarOpen = false;
  rightSidebarOpen = false;
  mobileMenuOpen = false;
  
  // Contenu
  activeSection = 'hero';
  currentTime = '';
  currentDate = '';
  scrollProgress = 0;
  showScrollProgress = true;
  
  // User
  isLoggedIn = false;
  userName = 'Utilisateur';
  userInitials = 'U';
  userAvatarColor = '#6366f1';
  
  // Audio
  soundEnabled = true;
  
  // Notifications
  unreadCount = 3;
  notifications: Notification[] = [
    { text: 'Nouvelle mise à jour disponible', time: '2 min', color: '#22c55e', read: false },
    { text: 'Votre rapport est prêt', time: '1h', color: '#6366f1', read: false },
    { text: 'Rappel: Réunion à 14h', time: '2h', color: '#f59e0b', read: false }
  ];
  
  // Activité
  activityFeed: Activity[] = [
    { initials: 'JD', color: '#6366f1', text: 'Jean a créé un projet', time: '5 min' },
    { initials: 'ML', color: '#a855f7', text: 'Marie a partagé un fichier', time: '12 min' },
    { initials: 'PK', color: '#ec4899', text: 'Paul s\'est connecté', time: '20 min' }
  ];
  
  // Météo
  weatherForecast: WeatherDay[] = [
    { name: 'Lun', icon: '☀️', temp: 24 },
    { name: 'Mar', icon: '⛅', temp: 22 },
    { name: 'Mer', icon: '🌧️', temp: 19 },
    { name: 'Jeu', icon: '⛅', temp: 21 },
    { name: 'Ven', icon: '☀️', temp: 25 }
  ];
  
  // Tâches
  quickTasks: Task[] = [
    { text: 'Vérifier emails', done: false },
    { text: 'Mettre à jour profil', done: true },
    { text: 'Explorer fonctionnalités', done: false }
  ];
  
  // Social
  socialLinks: SocialLink[] = [
    { name: 'Twitter', url: '#', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.163-2.723c-.951-.385-2.064-.578-3.34-.578-2.632 0-4.81 1.048-6.534 3.145C7.73 6.89 7.026 9.33 7.026 12.04c0 .386.043.764.129 1.134-3.523-.177-6.79-1.18-9.802-3.01C1.534 9.986.998 11.376.998 12.88c0 2.634 1.178 4.886 3.535 6.756-.548-.018-1.066-.168-1.554-.45v.045c0 3.689 2.44 6.82 6.32 7.396-.574.156-1.176.234-1.806.234-.417 0-.822-.04-1.214-.12.822 2.574 3.21 4.332 6.09 4.332 2.232 0 4.236-.938 6.012-2.814 1.772-1.876 2.678-4.008 2.678-6.396 0-.254-.01-.506-.03-.756a10.136 10.136 0 002.608-2.578z"/></svg>' },
    { name: 'GitHub', url: '#', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' },
    { name: 'LinkedIn', url: '#', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' }
  ];
  
  // Navigation
  navItems: NavItem[] = [
    { id: 'hero', label: 'Accueil', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { id: 'features', label: 'Fonctionnalités', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
    { id: 'testimonials', label: 'Témoignages', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' },
    { id: 'contact', label: 'Contact', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' }
  ];
  
  // Hero
  titleLines = ['UNIDYS', 'L\'unité du système'];
  tagline = 'Une plateforme unifiée pour connecter, simplifier et faire évoluer vos projets.';
  
  // Stats
  stats: Stat[] = [
    { icon: '👥', value: '10K+', label: 'Utilisateurs' },
    { icon: '⚡', value: '99%', label: 'Uptime' },
    { icon: '🌍', value: '50+', label: 'Pays' }
  ];
  
  // Features
  features: Feature[] = [
    { icon: '🚀', title: 'Performance', desc: 'Optimisé pour la vitesse et la fluidité', link: '#', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
    { icon: '🔒', title: 'Sécurité', desc: 'Protection de vos données en priorité', link: '#', gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
    { icon: '🎨', title: 'Design', desc: 'Interface moderne et intuitive', link: '#', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { icon: '⚙️', title: 'Personnalisation', desc: 'Adaptez selon vos besoins', link: '#', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)' }
  ];
  
  // Testimonials
  testimonials: Testimonial[] = [
    { initials: 'SM', name: 'Sophie Martin', role: 'Directrice technique', text: 'Unidys a transformé notre façon de travailler. Simple, rapide et efficace.', avatarColor: '#6366f1' },
    { initials: 'TL', name: 'Thomas Leroy', role: 'Chef de projet', text: 'Enfin une plateforme qui comprend les besoins des équipes modernes.', avatarColor: '#a855f7' },
    { initials: 'EC', name: 'Emma Chen', role: 'Développeuse', text: 'L\'accessibilité est au cœur du produit, c\'est rafraîchissant.', avatarColor: '#ec4899' }
  ];
  activeTestimonial = 0;
  
  // Vidéo
  videoOpen = false;
  
  private timeInterval: any;
  private testimonialInterval: any;
  private scrollHandler: any;

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Démarrer animations
    setTimeout(() => this.animationStarted = true, 100);
    
    // Horloge
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    
    // Carrousel témoignages
    this.testimonialInterval = setInterval(() => {
      this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
    }, 5000);
    
    // Scroll progress
    this.scrollHandler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = (scrollTop / docHeight) * 100;
    };
    window.addEventListener('scroll', this.scrollHandler);
    
    // Charger préférences
    this.loadPreferences();
    
    // Particules
    this.initParticles();
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
    clearInterval(this.testimonialInterval);
    window.removeEventListener('scroll', this.scrollHandler);
  }

  // Time
  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.currentDate = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // Navigation
  scrollToSection(id: string): void {
    this.activeSection = id;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToDashboard(): void {
    this.isLoading = true;
    setTimeout(() => this.router.navigate(['/dashboard']), 500);
  }

  showDemo(): void {
    this.scrollToSection('features');
  }

  showVideo(): void {
    this.videoOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeVideo(): void {
    this.videoOpen = false;
    document.body.style.overflow = '';
  }

  // Sidebars mobile
  toggleLeftSidebar(): void {
    this.leftSidebarOpen = !this.leftSidebarOpen;
    const sidebar = document.querySelector('.left-sidebar');
    sidebar?.classList.toggle('open', this.leftSidebarOpen);
  }

  toggleRightSidebar(): void {
    this.rightSidebarOpen = !this.rightSidebarOpen;
    const sidebar = document.querySelector('.right-sidebar');
    sidebar?.classList.toggle('open', this.rightSidebarOpen);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Toggles
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
  }

  toggleHighContrast(): void {
    this.highContrastMode = !this.highContrastMode;
    this.savePreference('highContrast', this.highContrastMode);
  }

  increaseFontSize(): void {
    if (this.fontSizeLevel < 4) {
      this.fontSizeLevel++;
      this.updateFontSize();
    }
  }

  decreaseFontSize(): void {
    if (this.fontSizeLevel > 1) {
      this.fontSizeLevel--;
      this.updateFontSize();
    }
  }

  private updateFontSize(): void {
    const sizes = ['14px', '16px', '18px', '20px'];
    this.baseFontSize = sizes[this.fontSizeLevel - 1];
    this.savePreference('fontSizeLevel', this.fontSizeLevel);
  }

  // Testimonials
  setTestimonial(index: number): void {
    this.activeTestimonial = index;
  }

  // Tâches
  addTask(): void {
    const text = prompt('Nouvelle tâche:');
    if (text) {
      this.quickTasks.push({ text, done: false });
    }
  }

  // Login
  showLogin(): void {
    this.isLoggedIn = true;
    this.userName = 'Jean Dupont';
    this.userInitials = 'JD';
  }

  // Particules
  private initParticles(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 20 + 's';
      p.style.animationDuration = (15 + Math.random() * 10) + 's';
      container.appendChild(p);
    }
  }

  // Préférences
  private savePreference(key: string, value: any): void {
    try {
      localStorage.setItem(`unidys_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Impossible de sauvegarder préférence');
    }
  }

  private loadPreferences(): void {
    try {
      this.highContrastMode = JSON.parse(localStorage.getItem('unidys_highContrast') || 'false');
      this.fontSizeLevel = JSON.parse(localStorage.getItem('unidys_fontSizeLevel') || '2');
      this.updateFontSize();
    } catch (e) {
      console.warn('Impossible de charger préférences');
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.videoOpen) this.closeVideo();
    if (this.mobileMenuOpen) this.toggleMobileMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 992) {
      this.leftSidebarOpen = false;
      this.rightSidebarOpen = false;
      document.querySelector('.left-sidebar')?.classList.remove('open');
      document.querySelector('.right-sidebar')?.classList.remove('open');
    }
  }
}