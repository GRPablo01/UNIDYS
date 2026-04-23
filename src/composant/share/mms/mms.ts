import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/services/theme.service';

export interface News {
  id: string;
  title: string;
  excerpt: string;
  date: Date;
  isRead: boolean;
  image?: string;
  category?: string;
}

@Component({
  selector: 'app-mms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mms.html',
  styleUrls: ['./mms.css'],
})
export class MMS {

  constructor(public themeService: ThemeService) {}

  // UI
  openNews: boolean = false;
  hoverNews: boolean = false;

  // Data
  newsFilter: 'all' | 'unread' = 'all';
  newsList: News[] = [
    {
      id: '1',
      title: 'Nouvelle fonctionnalité disponible',
      excerpt: 'Découvrez les nouvelles améliorations de la plateforme.',
      date: new Date(),
      isRead: false,
      category: 'Update',
      image: 'https://picsum.photos/400/200'
    },
    {
      id: '2',
      title: 'Maintenance prévue',
      excerpt: 'Une maintenance aura lieu ce week-end.',
      date: new Date(),
      isRead: true,
      category: 'Info'
    }
  ];

  // =========================
  // ACTIONS
  // =========================
  toggleNews() {
    this.openNews = !this.openNews;
  }

  get filteredNews(): News[] {
    return this.newsFilter === 'unread'
      ? this.newsList.filter(n => !n.isRead)
      : this.newsList;
  }

  hasUnreadNews(): boolean {
    return this.newsList.some(n => !n.isRead);
  }

  unreadNewsCount(): number {
    return this.newsList.filter(n => !n.isRead).length;
  }

  markNewsAsRead(news: News) {
    news.isRead = true;
  }

  markAllNewsAsRead() {
    this.newsList.forEach(n => n.isRead = true);
  }

  deleteNews(news: News) {
    this.newsList = this.newsList.filter(n => n.id !== news.id);
  }

  clearAllNews() {
    if (confirm('Voulez-vous vraiment supprimer toutes les actualités ?')) {
      this.newsList = [];
    }
  }

  openNewsDetail(news: News) {
    console.log('Voir détail:', news);
  }
}