import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JeuService } from '../../../../../Backend/services/jeu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jeu-qcm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jeu-qcm.html',
  styleUrls: ['./jeu-qcm.css'],
})
export class JeuQcm implements OnInit {

  idJeu: string | null = null;
  jeu: any = null;

  // ================= QCM =================
  reponseChoisie: string | null = null;
  qcmResultat: 'bon' | 'faux' | null = null;

  constructor(
    private route: ActivatedRoute,
    private jeuService: JeuService
  ) {}

  ngOnInit(): void {
    this.idJeu = this.route.snapshot.paramMap.get('id');

    if (!this.idJeu) return;

    this.jeuService.getJeuById(this.idJeu).subscribe({
      next: (data) => {
        this.jeu = data;
      },
      error: (err) => {
        console.error('Erreur chargement jeu :', err);
      }
    });
  }

  // ================= QCM =================
  selectionnerQcm(rep: string): void {
    this.reponseChoisie = rep;

    this.qcmResultat =
      rep === this.jeu.bonneReponse
        ? 'bon'
        : 'faux';
  }

}