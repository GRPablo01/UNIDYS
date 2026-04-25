import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JeuService } from '../../../../../Backend/services/jeu.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../Backend/services/theme.service';

@Component({
  selector: 'app-jeu-memorie',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jeu-memorie.html',
  styleUrls: ['./jeu-memorie.css'],
})
export class JeuMemorie implements OnInit {

  idJeu: string | null = null;
  jeu: any = null;

  cartes: any[] = [];

  private premiereCarte: any = null;
  private bloquer = false;

  // ================= VIES =================
  lives = 6;
  maxLives = 6;

  heartsArray: any[] = Array(3).fill('full');

  memorieResultat: 'win' | 'lose' | null = null;

  lockUntil: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private jeuService: JeuService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.idJeu = this.route.snapshot.paramMap.get('id');
    if (!this.idJeu) return;

    const lock = localStorage.getItem('memory_lock');
    if (lock) this.lockUntil = +lock;

    this.jeuService.getJeuById(this.idJeu).subscribe({
      next: (data) => {
        this.jeu = data;
        this.initJeu();
        this.updateHearts();
      }
    });
  }

  // ================= INIT =================
  initJeu() {
    if (!this.jeu?.cartes) return;

    const base = this.jeu.cartes.map((c: any) => ({
      ...c,
      ouverte: false,
      trouvee: false
    }));

    const paires = [...base, ...base.map((c: any) => ({ ...c }))];

    this.cartes = this.shuffle(paires);
  }

  // ================= GAME =================
  retournerCarte(carte: any) {

    if (this.bloquer || carte.ouverte || carte.trouvee || this.isLocked()) return;

    carte.ouverte = true;

    if (!this.premiereCarte) {
      this.premiereCarte = carte;
      return;
    }

    if (this.premiereCarte.valeur === carte.valeur) {
      this.premiereCarte.trouvee = true;
      carte.trouvee = true;
      this.premiereCarte = null;

      this.checkWin();
    } else {

      this.bloquer = true;

      this.loseLife(); // 💥 PERTE DE VIE

      setTimeout(() => {
        this.premiereCarte.ouverte = false;
        carte.ouverte = false;
        this.premiereCarte = null;
        this.bloquer = false;
      }, 700);
    }
  }

  // ================= VIES =================
  loseLife() {
    this.lives -= 1;

    this.updateHearts();

    if (this.lives <= 0) {
      this.memorieResultat = 'lose';
      this.lockGame();
    }
  }

  updateHearts() {
    this.heartsArray = Array(this.maxLives).fill('full').map((_, i) => {
      if (i < this.lives) return 'full';
      return 'empty';
    });
  }

  // ================= LOCK 2H =================
  lockGame() {
    const time = Date.now() + 1 * 60 * 60 * 1000;
    this.lockUntil = time;
    localStorage.setItem('memory_lock', time.toString());
  }

  isLocked() {
    return this.lockUntil ? Date.now() < this.lockUntil : false;
  }

  // ================= WIN =================
  checkWin() {
    const all = this.cartes.every(c => c.trouvee);

    if (all && this.lives > 0) {
      this.memorieResultat = 'win';
    }
  }

  getXp() {
    const n = this.jeu?.niveau?.toLowerCase();

    if (n === 'facile') return 20;
    if (n === 'moyen') return 45;
    if (n === 'difficile') return 75;

    return 20;
  }

  // ================= SHUFFLE =================
  shuffle(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
  }
}