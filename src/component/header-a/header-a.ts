import { Component } from '@angular/core';
import {MenuHamburgerA } from '../menu-hambuger-a/menu-hambuger-a';
import { Logo } from '../logo/logo';
import { Icon } from '../icon/icon';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header-a',
  imports: [Logo, Icon, RouterLink, MenuHamburgerA],
  templateUrl: './header-a.html',
  styleUrl: './header-a.css'
})
export class HeaderA {

}
