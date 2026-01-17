import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

interface Utilisateur {
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logo.html',
  styleUrls: ['./logo.css'],
})
export class Logo implements OnInit {
  // Nom de l'application
  appName: string = 'UniDys';

  // Variables pour le thème
  text: string = '';
  rouge: string = '';
  background: string = '';
  theme: 'clair' | 'sombre' = 'clair';
  Logo: string = '';
  hoverLogo: boolean = false;

  ngOnInit() {
    this.loadUserTheme();
  }

  /**
   * 🔹 Charger le thème depuis l'utilisateur stocké
   */
  private loadUserTheme() {
    const storedUser = localStorage.getItem('utilisateur');
    if (!storedUser) {
      this.theme = 'clair';
      this.setThemeColors();
      return;
    }

    try {
      const userObj: Utilisateur = JSON.parse(storedUser);
      if (userObj.theme === 'clair' || userObj.theme === 'sombre') {
        this.theme = userObj.theme;
      } else {
        this.theme = 'clair';
      }
    } catch (error) {
      console.error('Erreur parsing utilisateur depuis localStorage :', error);
      this.theme = 'clair';
    }

    this.setThemeColors();
  }

  /**
   * 🔹 Définir les couleurs et logo selon le thème
   */
  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.text = '#FFF';
      this.background = '#001219';
      this.rouge = '#b80000';
      this.Logo = 'assets/IconBlanc.svg';
    } else {
      this.text = '#000';
      this.background = '#FFF';
      this.rouge = '#9b0202';
      this.Logo = 'assets/IconBlack.svg';
    }
  }

  /**
   * 🔹 Changer le thème et mettre à jour le localStorage
   */
  toggleTheme() {
    this.theme = this.theme === 'clair' ? 'sombre' : 'clair';
    this.setThemeColors();
    this.updateUserLocalStorage();
    console.log('Thème après toggle :', this.theme);
  }

  /**
   * 🔹 Mettre à jour le thème de l'utilisateur dans le localStorage
   */
  private updateUserLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const userObj = JSON.parse(storedUser);
      userObj.theme = this.theme;
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (error) {
      console.error('Erreur mise à jour thème dans localStorage :', error);
    }
  }
}
