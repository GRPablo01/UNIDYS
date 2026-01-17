import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Icon } from "../../icon/icon";

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
  imports: [CommonModule, Icon],
  templateUrl: './notif.html',
  styleUrls: ['./notif.css'],
})
export class Notif implements OnInit {

  // Nombre de notifications
  nbNotifications: number = 0;

  // Couleurs et thème
  text: string = '';
  rouge: string = '';
  bleu: string = '';
  rose: string = '';
  orange: string = '';
  background: string = '';
  theme: 'clair' | 'sombre' = 'clair';
  Logo: string = '';

  // Infos utilisateur
  userId: string = '';
  username: string = '';
  role: string = '';
  notifications: number = 0;

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
      this.text = '#FFF';
      this.background = '#261466';
      this.rouge = '#b80000';
      this.bleu = '#4533FD';
      this.rose = '#F729FE';
      this.orange = '#FE8218';
      this.Logo = 'assets/IconBlanc.svg';
    } else {
      this.text = '#000';
      this.background = '#E9E7F5';
      this.rouge = '#9b0202';
      this.bleu = '#1101B6';
      this.rose = '#A902AF';
      this.orange = '#CF6103';
      this.Logo = 'assets/IconBlack.svg';
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
    const storedUser = localStorage.getItem('user');

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
