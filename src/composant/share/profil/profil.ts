import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from '../icon/icon';
import { ThemeService } from '../../../../Backend/services/theme.service';

interface Utilisateur {
  nom: string;
  prenom: string;
  photoProfil?: string; // ✅ nom cohérent
  role?: string;
  email?: string;
  statut?: 'en ligne' | 'ne pas déranger' | 'absent';
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, Icon, RouterLink],
})
export class Profil implements OnInit {

  utilisateur: Utilisateur | null = null;

  menuOpen = false;

  nom = '';
  prenom = '';
  role = '';
  email = '';
  initials = '';
  imageUrl: string | null = null;

  statut: 'en ligne' | 'ne pas déranger' | 'absent' = 'en ligne';
  StatutColor = '';

  unreadMessagesCount: number = 3;
  currentYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.setStatutColor();
  }

  /**
   * Chargement utilisateur depuis localStorage
   */
  private loadUser(): void {
    const userStr = localStorage.getItem('utilisateur');
  
    console.log('📦 localStorage utilisateur brut :', userStr);
  
    if (!userStr) {
      console.warn('⚠️ Aucun utilisateur dans le localStorage');
      return;
    }
  
    try {
      const user: Utilisateur = JSON.parse(userStr);
  
      console.log('✅ utilisateur parsé :', user);
  
      this.utilisateur = user;
  
      this.nom = user.nom || '';
      this.prenom = user.prenom || '';
      this.role = user.role || 'inviter';
      this.email = user.email || '';
      this.statut = user.statut || 'en ligne';
  
      console.log('🧾 données assignées :', {
        nom: this.nom,
        prenom: this.prenom,
        role: this.role,
        email: this.email,
        statut: this.statut
      });
  
      // ✅ IMAGE
      if (user.photoProfil) {
        this.imageUrl = user.photoProfil.startsWith('http')
          ? user.photoProfil
          : `http://localhost:3000/uploads/${user.photoProfil}`;
      } else {
        this.imageUrl = null;
      }
  
      console.log('🖼️ imageUrl générée :', this.imageUrl);
  
      this.generateInitials();
  
      console.log('🔤 initiales :', this.initials);
  
    } catch (error) {
      console.error('❌ Erreur parsing utilisateur', error);
    }
  }

  /**
   * Initiales
   */
  private generateInitials(): void {
    const n = this.nom?.charAt(0)?.toUpperCase() || '';
    const p = this.prenom?.charAt(0)?.toUpperCase() || '';
    this.initials = n + p;
  }

  /**
   * Menu toggle
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Click extérieur
   */
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#userMenuButton') && !target.closest('#userMenuDropdown')) {
      this.menuOpen = false;
    }
  }

  /**
   * Format rôle
   */
  formatRole(role: string | null | undefined): string {
    if (!role || role === 'inviter') return 'Supporter';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  /**
   * Statut
   */
  changeStatut(nouveauStatut: 'en ligne' | 'ne pas déranger' | 'absent'): void {
    this.statut = nouveauStatut;

    if (this.utilisateur) {
      this.utilisateur.statut = nouveauStatut;
      localStorage.setItem('utilisateur', JSON.stringify(this.utilisateur));
    }

    this.setStatutColor();
  }

  private setStatutColor(): void {
    switch (this.statut) {
      case 'en ligne': this.StatutColor = '#22C55E'; break;
      case 'ne pas déranger': this.StatutColor = '#EF4444'; break;
      case 'absent': this.StatutColor = '#F59E0B'; break;
      default: this.StatutColor = '#94A3B8'; break;
    }
  }

  getStatutLabel(): string {
    switch (this.statut) {
      case 'en ligne': return 'En ligne';
      case 'ne pas déranger': return 'Ne pas déranger';
      case 'absent': return 'Absent';
      default: return 'Hors ligne';
    }
  }

  /**
   * Déconnexion
   */
  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }

  /**
   * Styles rôle
   */
  getRoleGradient(role: string): string {
    const gradients: Record<string, string> = {
      'superadmin': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      'admin': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'prof': 'linear-gradient(135deg, #10b981, #059669)',
      'eleve': 'linear-gradient(135deg, #3b82f6, #2563eb)',
      'inviter': 'linear-gradient(135deg, #6b7280, #4b5563)'
    };
    return gradients[role] || gradients['inviter'];
  }

  getRoleBadgeBg(role: string): string {
    const colors: Record<string, string> = {
      'superadmin': 'rgba(251, 191, 36, 0.15)',
      'admin': 'rgba(139, 92, 246, 0.15)',
      'prof': 'rgba(16, 185, 129, 0.15)',
      'eleve': 'rgba(59, 130, 246, 0.15)',
      'inviter': 'rgba(107, 114, 128, 0.15)'
    };
    return colors[role] || colors['inviter'];
  }

  getRoleBadgeColor(role: string): string {
    const colors: Record<string, string> = {
      'superadmin': '#b45309',
      'admin': '#6d28d9',
      'prof': '#059669',
      'eleve': '#2563eb',
      'inviter': '#4b5563'
    };
    return colors[role] || colors['inviter'];
  }
}