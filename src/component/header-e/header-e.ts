import { Component } from '@angular/core';
import { Logo } from "../logo/logo";
import { Icon } from '../icon/icon';
import { MenuHamburgerE } from '../menu-hambuger-e/menu-hambuger-e';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-e',
  imports: [Logo, Icon,MenuHamburgerE,RouterLink,FormsModule,CommonModule],
  templateUrl: './header-e.html',
  styleUrl: './header-e.css'
})
export class HeaderE {

}
