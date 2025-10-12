import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/userService/Auth.Service';

@Component({
  selector: 'app-suprimer-e',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suprimer-e.html',
  styleUrls: ['./suprimer-e.css']
})
export class SuprimerE {
  showConfirmPopup = false; // pour afficher la popup

  constructor(private authService: AuthService, private router: Router) {}

  // Ouvre la popup de confirmation
  confirmDelete() {
    this.showConfirmPopup = true;
  }

  // Annule la suppression
  cancelDelete() {
    this.showConfirmPopup = false;
  }

  // Supprime le compte et toutes les données locales
  deleteAccount() {
    try {
      // ⚡ Supprime toutes les données utilisateur locales
      this.authService.clearUser();
      localStorage.clear();   // vide localStorage complet si nécessaire
      sessionStorage.clear(); // vide sessionStorage complet si nécessaire

      console.log('Compte et toutes les données locales supprimés définitivement.');

      alert('✅ Votre compte et toutes vos données ont été supprimés définitivement.');

      // Redirection vers la page d’accueil ou login
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Erreur suppression compte :', err);
      alert('❌ Erreur lors de la suppression du compte.');
    }
  }
}
