import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderP } from '../../../../component/header-p/header-p';
import { FormsModule } from '@angular/forms';


interface QcmQuestion {
  question: string;
  reponses: string[];
  bonneReponse: number;   // <-- correspond au champ backend
  xp: number;
}

@Component({
  selector: 'app-cours-detail-p',
  templateUrl: './cours-detail-p.html',
  styleUrls: ['./cours-detail-p.css'],
  standalone: true,
  imports: [CommonModule, HeaderP, FormsModule],
})
export class CoursdetailP implements OnInit {
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  idCours: string | null = null;
  reponsesUtilisateur: (number | null)[] = [];

  resultat: number | null = null;
  message = '';
  xp = 0;
  loading = true;
  showPopup = false;

  isProf: boolean = true; // <-- ici on simule que c’est un prof

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
    if (this.idCours) {
      this.loading = true;
      this.http
        .get<{ html: string; qcm: QcmQuestion[] }>(
          `http://localhost:3000/api/cours/complet/${this.idCours}`
        )
        .subscribe({
          next: ({ html, qcm = [] }) => {
            this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
            this.qcm = qcm;
            this.reponsesUtilisateur = qcm.map(() => null);

            this.resultat = null;
            this.message = '';
            this.xp = 0;
            this.showPopup = false;
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          },
        });
    }
  }

  estCoche(indexQ: number, indexR: number): boolean {
    return this.reponsesUtilisateur[indexQ] === indexR;
  }

  validerQCM(): void {
    if (this.isProf) return; // les profs ne peuvent pas valider

    for (let i = 0; i < this.qcm.length; i++) {
      if (this.reponsesUtilisateur[i] === null) {
        alert(`Réponds à la question ${i + 1}`);
        return;
      }
    }

    let score = 0;
    let xpTotal = 0;

    this.qcm.forEach((q, i) => {
      if (this.reponsesUtilisateur[i] === q.bonneReponse) {
        score++;
        xpTotal += q.xp || 0;
      }
    });

    this.resultat = score;
    this.xp = xpTotal;

    if (score === this.qcm.length) {
      this.message = '🎉 Bravo ! Toutes les réponses sont correctes.';
    } else if (score === 0) {
      this.message = '❌ Perdu ! Aucune bonne réponse.';
    } else {
      this.message = '👍 Bien essayé, mais tu peux faire mieux !';
    }

    this.showPopup = true;
  }

  questionEstJuste(indexQ: number): boolean {
    if (this.resultat === null) return false;
    return this.reponsesUtilisateur[indexQ] === this.qcm[indexQ]?.bonneReponse;
  }

  isBonneReponse(question: QcmQuestion, indexR: number): boolean {
    return indexR === question.bonneReponse;
  }

  get xptotal(): number {
    return this.qcm.reduce((t, q) => t + (q.xp || 0), 0);
  }
}
