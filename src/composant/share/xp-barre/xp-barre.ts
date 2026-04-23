import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../Backend/services/theme.service';

// Interface pour les paliers
interface Palier {
  niveau: number;
  nom: string;
  couleur: string;
  icone: string;
  xpRequis: number;
  bonus?: string;
}

@Component({
  selector: 'app-xp-barre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xp-barre.html',
  styleUrls: ['./xp-barre.css']
})
export class XpBarre implements OnInit {

  constructor(public themeService: ThemeService) {}

  // Données utilisateur
  role: string = '';
  xp: number = 0;

  niveau: number = 1;
  progression: number = 0;
  xpDansNiveauActuel: number = 0;
  xpRequisPourNiveau: number = 100;

  palierActuel: Palier | null = null;
  prochainPalier: Palier | null = null;
  progressionVersPalier: number = 0;

  // Liste des paliers
  paliers: Palier[] = [
    { niveau: 1, nom: 'Novice', couleur: 'from-gray-400 to-gray-600', icone: 'fa-seedling', xpRequis: 0 },
    { niveau: 5, nom: 'Apprenti', couleur: 'from-green-400 to-emerald-600', icone: 'fa-leaf', xpRequis: 500, bonus: 'Débloque les quiz avancés' },
    { niveau: 10, nom: 'Explorateur', couleur: 'from-blue-400 to-cyan-600', icone: 'fa-magnifying-glass', xpRequis: 1500, bonus: 'Badge exclusif' },
    { niveau: 20, nom: 'Aventurier', couleur: 'from-purple-400 to-violet-600', icone: 'fa-swords', xpRequis: 4500, bonus: 'Thème personnalisé' },
    { niveau: 35, nom: 'Expert', couleur: 'from-orange-400 to-red-600', icone: 'fa-trophy', xpRequis: 12000, bonus: 'Accès prioritaire' },
    { niveau: 50, nom: 'Maître', couleur: 'from-yellow-400 to-amber-600', icone: 'fa-crown', xpRequis: 30000, bonus: 'Titre exclusif' },
    { niveau: 75, nom: 'Légende', couleur: 'from-pink-400 to-rose-600', icone: 'fa-fire', xpRequis: 75000, bonus: 'Effets spéciaux' },
    { niveau: 100, nom: 'Immortel', couleur: 'from-indigo-400 to-purple-600', icone: 'fa-star', xpRequis: 200000, bonus: 'Statut VIP permanent' }
  ];

  ngOnInit(): void {
    const user = localStorage.getItem('utilisateur');
    if (user) {
      const userData = JSON.parse(user);
      this.role = userData.role;
      this.xp = userData.xp || 0;
      if (this.role === 'eleve') {
        this.calculerNiveau();
        this.determinerPaliers();
      }
    }
  }

  // Calcul du niveau basé sur l'XP
  calculerNiveau() {
    let xpCumule = 0;
    let niveauCalcule = 1;
    let xpPourProchain = 100;

    while (this.xp >= xpCumule + xpPourProchain && niveauCalcule < 100) {
      xpCumule += xpPourProchain;
      niveauCalcule++;
      xpPourProchain = Math.floor(xpPourProchain * 1.1);
    }

    this.niveau = Math.min(niveauCalcule, 100);
    this.xpDansNiveauActuel = this.xp - xpCumule;
    this.xpRequisPourNiveau = xpPourProchain;
    this.progression = Math.min((this.xpDansNiveauActuel / this.xpRequisPourNiveau) * 100, 100);
  }

  // Détermination des paliers actuels et suivants
  determinerPaliers() {
    this.palierActuel = this.paliers.filter(p => this.niveau >= p.niveau).pop() || this.paliers[0];
    this.prochainPalier = this.paliers.find(p => p.niveau > this.niveau) || null;

    if (this.prochainPalier) {
      const index = this.paliers.indexOf(this.prochainPalier);
      const palierPrecedent = this.paliers[index - 1];
      const xpPalierPrecedent = palierPrecedent ? palierPrecedent.xpRequis : 0;
      const xpRequisPourPalier = this.prochainPalier.xpRequis - xpPalierPrecedent;
      const xpAcquisDepuisPalier = this.xp - xpPalierPrecedent;
      this.progressionVersPalier = Math.min((xpAcquisDepuisPalier / xpRequisPourPalier) * 100, 100);
    } else {
      this.progressionVersPalier = 100;
    }
  }

  get couleurActuelle(): string {
    return this.palierActuel?.couleur || 'from-yellow-400 to-orange-500';
  }

  get iconeActuelle(): string {
    return this.palierActuel?.icone || 'fa-star';
  }

  get xpRestants(): number {
    return Math.max(0, this.xpRequisPourNiveau - this.xpDansNiveauActuel);
  }

}