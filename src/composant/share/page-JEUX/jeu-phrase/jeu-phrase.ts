import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JeuService } from '../../../../../Backend/services/jeu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jeu-phrase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jeu-phrase.html',
  styleUrls: ['./jeu-phrase.css'],
})
export class JeuPhrase implements OnInit {

  idJeu: string | null = null;
  jeu: any = null;

  // ================= PHRASE =================
  phraseOriginale: string = '';
  phraseConstruite: string[] = [];
  motsDisponibles: any[] = [];
  phraseResultat: 'bon' | 'faux' | null = null;

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

    if (this.jeu.type === 'phrasejeux' || this.jeu.type === 'phrase') {
      this.phraseOriginale = this.jeu.phraseOriginale || '';

      const mots = this.rebuildMots(this.jeu.motsMelanges || []);

      this.motsDisponibles = this.shuffleArray(
        mots.map((mot: string) => ({
          mot: mot,
          utilise: false
        }))
      );

      this.phraseConstruite = [];
      this.phraseResultat = null;
    }
  }

  // ================= REBUILD MOTS =================
  rebuildMots(data: any[]): string[] {
    if (!data || data.length === 0) return [];

    const fullString = data.map(d => d.mot || '').join('');

    const regex = /"mot"\s*:\s*"([^"]+)"/g;

    const result: string[] = [];
    let match;

    while ((match = regex.exec(fullString)) !== null) {
      result.push(match[1]);
    }

    return result;
  }

  // ================= UTIL =================
  getMotClean(mot: any): string {
    if (!mot) return '';
    if (typeof mot === 'string') return mot;
    if (mot.mot) return mot.mot;
    return '';
  }

  shuffleArray(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
  }

  // ================= PHRASE =================
  ajouterMot(mot: any, i: number) {
    if (mot.utilise) return;

    this.phraseConstruite.push(mot.mot);
    this.motsDisponibles[i].utilise = true;
  }

  resetPhrase() {
    this.phraseConstruite = [];
    this.motsDisponibles.forEach(m => m.utilise = false);
    this.phraseResultat = null;
  }

  verifierPhrase() {
    const phrase = this.phraseConstruite.join(' ');
    this.phraseResultat =
      phrase === this.phraseOriginale ? 'bon' : 'faux';
  }
}