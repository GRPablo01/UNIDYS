import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { Icon } from '../icon/icon';

import { ProfileService } from '../../services/userService/Profile.Service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-hambuger-p',
  imports: [CommonModule,RouterLink,HttpClientModule,Icon],
  templateUrl: './menu-hambuger-p.html',
  styleUrl: './menu-hambuger-p.css'
})
export class MenuHamburgerP {
  menuOuvert = false;
  mobileMenu = false;

  constructor(
    public userprofil: ProfileService,
    private router: Router
  ) { }

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

  deconnecter() {
    localStorage.removeItem('token');
    localStorage.removeItem('nomProf');
    this.userprofil.clearProfile();
    this.fermerMenus();
    this.router.navigate(['/connexion']);
  }
}
