import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderP } from "../../../../component/header-p/header-p";
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

interface QcmQuestion {
  question: string;
  reponses: string[];
  bonnesReponses: number[]; // index des bonnes réponses
}

@Component({
  selector: 'app-cours-detail-p',
  templateUrl: './cours-detail-p.html',
  styleUrls: ['./cours-detail-p.css'],
  standalone: true,
  imports: [CommonModule, HeaderP, FormsModule, HttpClientModule],
})
export class CoursDetailP implements OnInit, OnDestroy {
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  idCours: string | null = null;
  reponsesChoisies: number[][] = [];
  resultat: number | null = null;

  private refreshSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
  
    if (this.idCours) {
      this.chargerCours();
  
      // Rafraîchissement automatique une seule fois après 5 secondes
      setTimeout(() => {
        this.chargerCours();
      },0);
    }
  }
  

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  /** Charge le contenu du cours et le QCM */
  private chargerCours(): void {
    this.http
      .get<{ html: string; qcm: QcmQuestion[] }>(
        `http://localhost:3000/api/cours/complet/${this.idCours}`
      )
      .subscribe({
        next: (data) => {
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(data.html);
          // Si le QCM a changé, réinitialiser les réponses
          if (JSON.stringify(data.qcm) !== JSON.stringify(this.qcm)) {
            this.qcm = data.qcm || [];
            this.reponsesChoisies = this.qcm.map(() => []);
            this.resultat = null;
          }
        },
        error: (err) => console.error('Erreur lors du chargement du contenu du cours', err),
      });
  }

  /** Vérifie si une réponse est cochée */
  estCoche(indexQuestion: number, indexReponse: number): boolean {
    return this.reponsesChoisies[indexQuestion]?.includes(indexReponse) ?? false;
  }

  /** Toggle des réponses cochées */
  toggleReponse(indexQuestion: number, indexReponse: number, estCoche: boolean): void {
    if (!this.reponsesChoisies[indexQuestion]) {
      this.reponsesChoisies[indexQuestion] = [];
    }
    const reponses = this.reponsesChoisies[indexQuestion];
    if (estCoche) {
      if (!reponses.includes(indexReponse)) reponses.push(indexReponse);
    } else {
      const pos = reponses.indexOf(indexReponse);
      if (pos > -1) reponses.splice(pos, 1);
    }
  }

  /** Valider le QCM et calculer le score */
  validerQCM(): void {
    let score = 0;
    for (let i = 0; i < this.qcm.length; i++) {
      const bonnes = this.qcm[i].bonnesReponses.slice().sort();
      const choisies = (this.reponsesChoisies[i] || []).slice().sort();
      if (JSON.stringify(bonnes) === JSON.stringify(choisies)) {
        score++;
      }
    }
    this.resultat = score;
  }

  /** Vérifie si une question est juste après validation */
  questionEstJuste(indexQuestion: number): boolean {
    if (this.resultat === null) return false;
    const bonnes = this.qcm[indexQuestion].bonnesReponses.slice().sort();
    const choisies = (this.reponsesChoisies[indexQuestion] || []).slice().sort();
    return JSON.stringify(bonnes) === JSON.stringify(choisies);
  }

  /** Réinitialiser le QCM */
  reinitialiserQCM(): void {
    this.reponsesChoisies = this.qcm.map(() => []);
    this.resultat = null;
  }

  /** Vérifie si une réponse est bonne pour le surlignage après validation */
  isBonneReponse(question: QcmQuestion | undefined, indexReponse: number): boolean {
    if (!question || !question.bonnesReponses) return false;
    return question.bonnesReponses.includes(indexReponse);
  }
}
