import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../../services/userService/Profile.Service';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Icon } from '../icon/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-hambuger-e',
  standalone: true,
  imports: [CommonModule, Icon, RouterLink],
  templateUrl: './menu-hambuger-e.html',
  styleUrls: ['./menu-hambuger-e.css']
})
export class MenuHamburgerE implements OnInit, OnDestroy {
  menuOuvert = false;
  mobileMenu = false;
  private routerSub!: Subscription;

  constructor(
    public userprofil: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔹 Fermer automatiquement quand on change de page
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.fermerMenus();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
    this.mobileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.menuOuvert = false;
  }

  fermerMenus() {
    this.menuOuvert = false;
    this.mobileMenu = false;
  }

  // 🔹 Fermer si on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const insideMenu = target.closest('app-menu-hambuger-e'); // vérifie si le clic est dans le menu
    if (!insideMenu) {
      this.fermerMenus();
    }
  }

  deconnecter() {
    localStorage.removeItem('token');
    this.userprofil.clearProfile();
    this.router.navigate(['/connexion']);
  }
}
