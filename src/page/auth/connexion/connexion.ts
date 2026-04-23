import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Login } from '../../../composant/auth/login/login';
import { Icon } from "../../../composant/share/icon/icon";
import { Mobile } from '../../../composant/share/mobile/mobile';


@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, RouterLink, Login, Icon, Mobile],
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']
})
export class Connexion implements OnInit, OnDestroy {

  // 🔥 État de chargement (animation)
  isLoaded: boolean = false;

  // 📱 Responsive
  isMobile: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // 🧠 Titre onglet
    this.titleService.setTitle('UniDys | Connexion');

    // 🎬 Petit effet d’apparition
    setTimeout(() => {
      this.isLoaded = true;
    }, 50);

    // 📱 Vérification taille écran
    this.checkScreen();

    // 🔒 Bloquer le scroll (optionnel)
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // 🔓 Réactiver le scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }

  // 📏 Resize dynamique
  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  // 📱 Détection mobile
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
}