import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/services/theme.service';



@Component({
  selector: 'app-pourquoi',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './pourquoi.html',
  styleUrls: ['./pourquoi.css']
})
export class Pourquoi implements OnInit {

  // Données utilisateur
  cours: any[] = [];
  dysListe: any[] = [];
  eleveKey: string = '';
  eleveRelations: any[] = [];
  email: string = '';
  font: string = '';
  initiale: string = '';
  luminosite: number = 100;
  nom: string = '';
  photoProfil: string = '';
  prenom: string = '';
  qcm: any[] = [];
  role: string = '';
  theme: string = 'clair';
  xp: number = 0;

  // Propriétés style
  background: string = '';
  text: string = '';
  rouge: string = '';
  Logo: string = '';
  pattern1: string = '';
  pattern2: string = '';

  Bleu0: string = '';
  Bleu1: string = '';
  Bleu2: string = '';
 

  Vert0: string = '';
  Vert1: string = '';
  Vert2: string = '';

  Rouge0: string = '';
  Rouge1: string = '';
  Rouge2: string = '';

  Orange0: string = '';
  Orange1: string = '';
  Orange2: string = '';
  constructor(
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {

    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);

      ({
        cours: this.cours,
        dysListe: this.dysListe,
        eleveKey: this.eleveKey,
        eleveRelations: this.eleveRelations,
        email: this.email,
        font: this.font,
        initiale: this.initiale,
        luminosite: this.luminosite,
        nom: this.nom,
        photoProfil: this.photoProfil,
        prenom: this.prenom,
        qcm: this.qcm,
        role: this.role,
        theme: this.theme,
        xp: this.xp
      } = utilisateur);
    }
  }
}
