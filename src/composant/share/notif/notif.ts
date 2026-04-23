import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../../Backend/services/theme.service';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: Date;
  isRead: boolean;

  // options UI (facultatif mais utilisé dans ton HTML)
  icon?: string;
  avatar?: string;
  iconColor?: string;
  priority?: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-notif',
  standalone: true,
  templateUrl: './notif.html',
  styleUrls: ['./notif.css'],
  imports: [CommonModule]
})
export class Notif implements OnInit {

  hoverNotif = false;
  openCenter = false;
  hover = false;

  notifications: NotificationItem[] = [];
  toasts: NotificationItem[] = [];

  filter: 'all' | 'unread' = 'all';

  constructor(public themeservice: ThemeService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  toggleCenter() {
    this.openCenter = !this.openCenter;
  }

  // ===============================
  // LOAD
  // ===============================
  loadNotifications() {
    const saved = localStorage.getItem('notifications');

    if (saved) {
      const parsed = JSON.parse(saved);

      // ⚠️ on reconvertit les dates
      this.notifications = parsed.map((n: any) => ({
        ...n,
        date: new Date(n.date)
      }));
    } else {
      this.notifications = [
        {
          id: '1',
          title: 'Bienvenue 👋',
          message: 'Bienvenue sur votre espace utilisateur.',
          date: new Date(),
          isRead: false,
          icon: 'fa-solid fa-user',
          priority: 'low'
        },
        {
          id: '2',
          title: 'Mise à jour',
          message: 'Une nouvelle version est disponible.',
          date: new Date(),
          isRead: false,
          icon: 'fa-solid fa-rocket',
          priority: 'high'
        }
      ];
    }

    this.updateToasts();
  }

  // ===============================
  // GETTERS
  // ===============================
  get filteredNotifications() {
    return this.filter === 'unread'
      ? this.notifications.filter(n => !n.isRead)
      : this.notifications;
  }

  hasUnread(): boolean {
    return this.notifications.some(n => !n.isRead);
  }

  unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // ===============================
  // ACTIONS
  // ===============================
  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.updateToasts();
    this.save();
  }

  markAsRead(notification: NotificationItem) {
    notification.isRead = true;
    this.updateToasts();
    this.save();
  }

  deleteNotification(n: NotificationItem) {
    this.notifications = this.notifications.filter(item => item !== n);
    this.updateToasts();
    this.save();
  }

  clearAll() {
    if (confirm('Voulez-vous vraiment supprimer toutes les notifications ?')) {
      this.notifications = [];
      this.updateToasts();
      this.save();
    }
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }

  // ===============================
  // HELPERS
  // ===============================
  updateToasts() {
    this.toasts = this.notifications.filter(n => !n.isRead);
  }

  save() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }
}