import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JeuService } from '../../../../../Backend/services/jeu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jeu-puzzle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jeu-puzzle.html',
  styleUrls: ['./jeu-puzzle.css'],
})
export class JeuPuzzle implements OnInit {

  idJeu: string | null = null;
  jeu: any = null;

  // ================= PUZZLE =================
  motTroueArray: string[] = [];
  motOriginal: string = '';
  lettresDisponibles: { val: string; utilisee: boolean }[] = [];
  reponses: (string | null)[] = [];
  positionsCachees: number[] = [];
  resultat: 'bon' | 'faux' | null = null;

  dragLettre: string | null = null;
  dragIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private jeuService: JeuService
  ) {}

  ngOnInit() {
    this.idJeu = this.route.snapshot.paramMap.get('id');
    if (!this.idJeu) return;

    this.jeuService.getJeuById(this.idJeu).subscribe({
      next: (data) => {
        this.jeu = data;
        this.initJeu();
      }
    });
  }

  // ================= INIT =================
  initJeu() {
    if (!this.jeu) return;

    if (this.jeu.type === 'puzzle') {
      this.motOriginal = this.jeu.mot || '';
      this.positionsCachees = this.jeu.positionsCachees || [];

      this.motTroueArray = this.jeu.motTroue
        ? this.jeu.motTroue.split('')
        : this.motOriginal.split('').map(() => '_');

      const lettres =
        this.jeu.lettresManquantes?.length
          ? this.jeu.lettresManquantes
          : this.positionsCachees.map((i: number) => this.motOriginal[i]);

      this.lettresDisponibles = this.shuffleArray(
        lettres.map((l: string) => ({ val: l, utilisee: false }))
      );

      this.reponses = Array(this.motOriginal.length).fill(null);
      this.resultat = null;
    }
  }

  // ================= PUZZLE =================
  verifier() {
    const complet = this.motTroueArray
      .map((c, i) => c === '_' ? this.reponses[i] : c)
      .join('');

    this.resultat = complet === this.motOriginal ? 'bon' : 'faux';
  }

  drag(e: DragEvent, lettre: any, index: number) {
    this.dragLettre = lettre.val;
    this.dragIndex = index;
    e.dataTransfer?.setData('text', lettre.val);
  }

  allowDrop(e: DragEvent) {
    e.preventDefault();
  }

  drop(e: DragEvent, pos: number) {
    e.preventDefault();

    if (this.reponses[pos]) return;

    if (this.dragLettre !== null) {
      this.reponses[pos] = this.dragLettre;
      this.lettresDisponibles[this.dragIndex].utilisee = true;
    }
  }

  resetPuzzle(): void {

    // vider les réponses
    this.reponses = [];
  
    // reset résultat
    this.resultat = null;
  
    // réactiver lettres
    this.lettresDisponibles = this.lettresDisponibles.map(lettre => ({
      ...lettre,
      utilisee: false
    }));
  
  }
  // ================= UTIL =================
  shuffleArray(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
  }
}