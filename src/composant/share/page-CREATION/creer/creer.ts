import { Component } from '@angular/core';
import { ThemeService } from '../../../../../Backend/services/theme.service';
import { CommonModule } from '@angular/common';
import { Icon } from '../../icon/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-creer',
  imports: [CommonModule,Icon,RouterLink],
  templateUrl: './creer.html',
  styleUrl: './creer.css',
})
export class Creer {

  constructor(
    public themeService: ThemeService,
  ) {}


  isGuideModalOpen = false;

openGuideModal() {
  this.isGuideModalOpen = true;
  document.body.style.overflow = 'hidden'; // Empêche le scroll du body
}

closeGuideModal() {
  this.isGuideModalOpen = false;
  document.body.style.overflow = 'auto'; // Réactive le scroll
}
}
