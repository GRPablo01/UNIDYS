import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-creer-jeux2',
  standalone: true,
  imports: [FormsModule, CommonModule,HttpClientModule],
  templateUrl: './creer-jeux2.html',
  styleUrl: './creer-jeux2.css',
})
export class CreerJeux2 {

  constructor(private http: HttpClient) {}

  // 🎮 FORMULAIRE PRINCIPAL
  jeu: any = {
    titre: '',
    type: '',
    niveau: '',
    consigne: '',
    mots: '',
    difficulte: 'facile',

    // 🔵 QCM
    question: '',
    options: '', // string séparée par virgule
    reponse: '',

    // 🟡 PUZZLE
    mot: '',
    lettresManquantes: '',

    // 🟢 TEXTE
    phrase: '',
    trou: '',

    // 🔴 MEMORY
    cartes: ''
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  // 🎯 TYPES
  typesJeux = [
    'qcm',
    'puzzle',
    'texte',
    'memory'
  ];

  niveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

  // 🚀 CREATION JEU
  creerJeu() {

    if (!this.jeu.titre || !this.jeu.type || !this.jeu.niveau) {
      this.errorMessage = "⚠️ Remplis tous les champs obligatoires";
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // =========================
    // 📦 TRANSFORMATION DATA IA
    // =========================
    const data: any = {
      titre: this.jeu.titre,
      type: this.jeu.type,
      niveau: this.jeu.niveau,
      consigne: this.jeu.consigne,
      difficulte: this.jeu.difficulte,
      mots: this.jeu.mots,
      prof: 'profTest'
    };

    // 🔵 QCM
    if (this.jeu.type === 'qcm') {
      data.question = this.jeu.question;
      data.options = this.jeu.options;
      data.reponse = this.jeu.reponse;
    }

    // 🟡 PUZZLE
    if (this.jeu.type === 'puzzle') {
      data.mot = this.jeu.mot;
      data.lettresManquantes = this.jeu.lettresManquantes;
    }

    // 🟢 TEXTE
    if (this.jeu.type === 'texte') {
      data.phrase = this.jeu.phrase;
      data.trou = this.jeu.trou;
    }

    // 🔴 MEMORY
    if (this.jeu.type === 'memory') {
      data.cartes = this.jeu.cartes;
    }

    // =========================
    // 📡 API CALL
    // =========================
    this.http.post('http://localhost:3000/api/jeux', data).subscribe({
      next: (res) => {
        console.log(res);

        this.successMessage = "🎉 Jeu créé avec succès !";
        this.loading = false;

        // reset
        this.jeu = {
          titre: '',
          type: '',
          niveau: '',
          consigne: '',
          mots: '',
          difficulte: 'facile',

          question: '',
          options: '',
          reponse: '',

          mot: '',
          lettresManquantes: '',

          phrase: '',
          trou: '',

          cartes: ''
        };
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "❌ Erreur serveur";
        this.loading = false;
      }
    });
  }
}