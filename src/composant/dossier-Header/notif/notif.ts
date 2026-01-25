import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Icon } from "../../icon/icon";
import { FormsModule } from '@angular/forms';

interface Utilisateur {
  _id: string;
  nom: string;
  role: string;
  notifications: number;
  theme: 'clair' | 'sombre';
}

@Component({
  selector: 'app-notif',
  standalone: true,
  imports: [CommonModule, Icon,FormsModule],
  templateUrl: './notif.html',
  styleUrls: ['./notif.css'],
})
export class Notif implements OnInit {

  // Nombre de notifications
  nbNotifications: number = 3;

  // Couleurs et thème
  text: string = '';
  rouge: string = '';

  Forme: string = '';

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

  background: string = '';
  theme: 'clair' | 'sombre' = 'clair';
  Logo: string = '';

  // Infos utilisateur
  userId: string = '';
  username: string = '';
  role: string = '';
  notifications: number = 3;

  // Hover sur notification
  hoverNotif: boolean = false;

  ngOnInit() {
    this.loadUserInfo();
  }

  /**
   * Récupère l'utilisateur depuis le localStorage
   */
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur'); // On utilise toujours "user"

    if (!storedUser) {
      console.log('Pas d’utilisateur trouvé dans le localStorage. Thème par défaut : clair');
      this.theme = 'clair';
      this.setThemeColors();
      return;
    }

    try {
      const userObj: Utilisateur = JSON.parse(storedUser);

      this.userId = userObj._id || '';
      this.username = userObj.nom || '';
      this.role = userObj.role || '';
      this.notifications = userObj.notifications || 0;
      this.nbNotifications = this.notifications;

      // Vérification du thème
      if (userObj.theme === 'clair' || userObj.theme === 'sombre') {
        this.theme = userObj.theme;
      } else {
        this.theme = 'clair';
      }

      console.log('Utilisateur récupéré depuis le localStorage :', userObj);
      console.log('Theme appliqué :', this.theme);

    } catch (error) {
      console.error('Erreur parsing utilisateur depuis localStorage :', error);
      this.theme = 'clair';
    }

    this.setThemeColors();
  }

  /**
   * Définit les couleurs selon le thème
   */
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
  /**
   * Change le thème et met à jour le localStorage
   */
  toggleTheme() {
    this.theme = this.theme === 'clair' ? 'sombre' : 'clair';
    this.setThemeColors();
    this.updateUserLocalStorage();
    console.log('Thème après toggle :', this.theme);
  }

  /**
   * Incrémente le nombre de notifications et met à jour le localStorage
   */
  incrementNotif() {
    this.nbNotifications++;
    this.notifications++;
    this.updateUserLocalStorage();
  }

  /**
   * Supprime toutes les notifications et met à jour le localStorage
   */
  clearNotif() {
    this.nbNotifications = 0;
    this.notifications = 0;
    this.updateUserLocalStorage();
  }

  /**
   * Met à jour l'objet utilisateur dans le localStorage
   */
  private updateUserLocalStorage(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) return;

    try {
      const userObj = JSON.parse(storedUser);
      userObj.notifications = this.notifications;
      userObj.theme = this.theme;
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (error) {
      console.error('Erreur mise à jour utilisateur dans localStorage :', error);
    }
  }

  /**
   * Gestion du hover sur la notification
   */
  onHover(etat: boolean) {
    this.hoverNotif = etat;
    this.text = etat ? '#FFF' : (this.theme === 'sombre' ? '#FFF' : '#000');
  }
}
