import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/services/theme.service';

@Component({
  selector: 'app-dys-barre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dys-barre.html',
  styleUrl: './dys-barre.css',
})
export class DysBarre implements OnInit {

  constructor(public themeService: ThemeService) {}

  role: string | null = null;
  dysListe: string[] = [];

  ngOnInit(): void {
    const userData = localStorage.getItem('utilisateur');

    if (userData) {
      const user = JSON.parse(userData);

      this.role = user.role;

      // uniquement pour élève
      if (this.role === 'eleve') {
        this.dysListe = user.dysListe || [];
      }
    }
  }
}