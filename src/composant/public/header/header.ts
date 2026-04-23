import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from '../../share/nav/nav';
import { Theme } from '../../share/theme/theme';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { Profil } from "../../share/profil/profil";
import { Logo } from '../../share/logo/logo';
import { Icon2 } from '../../share/icon2/icon2';
import { Icon } from "../../share/icon/icon";
import { Search } from '../../share/search/search';
import { Icon3 } from '../../share/icon3/icon3';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, Nav, Profil, Logo, Icon2, Icon, Search,Icon3],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  ThemeImage: string = 'assets/LogoBlack.png'; // logo clair **toujours par défaut**
  isDarkMode: boolean = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    // On récupère l'état actuel du thème sans changer le logo
    this.isDarkMode = this.themeService.isDarkMode;

    // S'abonner aux changements de thème pour mettre à jour le logo uniquement si l'utilisateur clique sur toggle
    this.themeService.isDarkMode$.subscribe((mode) => {
      this.isDarkMode = mode;

      // ⚡️ Changement du logo **uniquement si mode sombre activé par l'utilisateur**
      if (mode) {
        this.ThemeImage = this.themeService.ThemeImage;
      } else {
        this.ThemeImage = 'assets/LogoBlack.png'; // toujours logo clair en mode clair
      }
    });
  }

  // Fonction pour basculer le thème
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}