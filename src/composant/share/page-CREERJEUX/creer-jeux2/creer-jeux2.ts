import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../../../../../Backend/services/theme.service';

@Component({
  selector: 'app-creer-jeux2',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './creer-jeux2.html',
  styleUrl: './creer-jeux2.css',
})
export class CreerJeux2 {

  constructor(private http: HttpClient,
    public themeService: ThemeService
  ) {}

  // =========================
  // 👤 GET PROF FROM LOCALSTORAGE
  // =========================
  getProfFromLocalStorage(): string {
    const user = localStorage.getItem('utilisateur');
  
    console.log('📦 Donnée brute localStorage (utilisatuer) :', user);
  
    if (!user) {
      console.log('⚠️ Aucun utilisateur trouvé, fallback profTest');
      return 'profTest';
    }
  
    try {
      const parsed = JSON.parse(user);
  
      const prof = `${parsed.nom || ''} ${parsed.prenom || ''}`.trim() || 'profTest';
  
      console.log('👤 Utilisateur parsé :', parsed);
      console.log('✅ Prof récupéré :', prof);
  
      return prof;
    } catch (e) {
      console.log('❌ Erreur JSON parse localStorage :', e);
      return 'profTest';
    }
  }

  // =========================
  // 🎮 FORMULAIRE
  // =========================
  jeu: any = {
    titre: '',
    type: '',
    niveau: '',
    consigne: '',
    difficulte: 'facile',
    prof: this.getProfFromLocalStorage(), // ✅ MODIF ICI
    memoryType: 'number',

    // 🔵 QCM
    question: '',
    options: '',
    reponse: '',
    indexReponse: null,

    // 🟡 PUZZLE
    mot: '',
    motTroue: '',
    lettresManquantes: '',
    positionsCachees: '',

    // 🟢 PHRASE
    phraseOriginale: '',
    motsMelanges: '',

    // 🧠 MEMORY
    cartes: '',
    typeMemory: 'images'
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  animalsBank = [
    { nom: 'Chat', image: 'assets/animals/chat.png' },
    { nom: 'Chien', image: 'assets/animals/chien.png' },
    { nom: 'Lion', image: 'assets/animals/lion.png' },
    { nom: 'Tigre', image: 'assets/animals/tigre.png' },
    { nom: 'Elephant', image: 'assets/animals/elephant.png' },
  ];

  // =========================
  // 🎯 TYPES
  // =========================
  typesJeux = ['qcm', 'puzzle', 'phrasejeux', 'memory'];
  step = 1;
  niveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

  // QCM
  qcmOptions: string[] = ['', ''];

  // Memory
  memoryCards: any[] = [];

  // Phrase
  phrasePreview: any[] = [];

  optionsText: string = '';

  // Puzzle
  hiddenPositions: number[] = [];

  // =========================
  // 🚀 CREATE JEU
  // =========================
  creerJeu() {

    // =========================
    // ⚠️ VALIDATION
    // =========================
    if (!this.jeu.titre || !this.jeu.type || !this.jeu.niveau) {
      this.errorMessage = "⚠️ Remplis les champs obligatoires";
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // =========================
    // 📦 BASE DATA
    // =========================
    const data: any = {
      titre: this.jeu.titre,
      type: this.jeu.type,
      niveau: this.jeu.niveau,
      consigne: this.jeu.consigne,
      difficulte: this.jeu.difficulte,
      prof: this.getProfFromLocalStorage() // ✅ SÉCURITÉ ICI AUSSI
    };

    // =========================
    // 🔵 QCM
    // =========================
    if (this.jeu.type === 'qcm') {

      const options = this.qcmOptions
        .map(o => o?.trim())
        .filter(Boolean);

      data.question = this.jeu.question;
      data.options = options;
      data.reponse = this.jeu.reponse;
      data.indexReponse = options.indexOf(this.jeu.reponse);
    }

    // =========================
    // 🟡 PUZZLE
    // =========================
    if (this.jeu.type === 'puzzle') {
      data.mot = this.jeu.mot;
      data.motTroue = this.jeu.motTroue;

      data.lettresManquantes = this.jeu.lettresManquantes
        ? this.jeu.lettresManquantes.split(',').map((l: string) => l.trim())
        : [];

      data.positionsCachees = this.jeu.positionsCachees
        ? this.jeu.positionsCachees.split(',').map((p: string) => Number(p))
        : [];
    }

    // =========================
    // 🟢 PHRASE
    // =========================
    if (this.jeu.type === 'phrasejeux') {
      data.phraseOriginale = this.jeu.phraseOriginale;

      data.motsMelanges = this.jeu.motsMelanges
        ? this.jeu.motsMelanges.split(',').map((m: string) => ({
            id: Math.random(),
            mot: m.trim()
          }))
        : [];
    }

    // =========================
    // 🧠 MEMORY
    // =========================
    if (this.jeu.type === 'memory') {
      data.memoryType = this.jeu.memoryType;
      data.cartes = this.memoryCards;
      data.pairs = Math.floor(this.memoryCards.length / 2);
    }

    // =========================
    // 📡 API CALL
    // =========================
    this.http.post('http://localhost:3000/api/jeux', data).subscribe({
      next: () => {

        this.successMessage = "🎉 Jeu créé avec succès !";
        this.loading = false;
      
        // 🔄 RESET FORM
        this.resetForm();
      
        // ⬅️ retour étape 1
        this.step = 1;
      
        // ⏱️ disparition automatique du message
        setTimeout(() => {
          this.successMessage = '';
        }, 3000); // 3 secondes (tu peux ajuster)
      },

      error: (err) => {
        console.error(err);
        this.errorMessage = "❌ Erreur serveur";
        this.loading = false;
      }
    });
  }

  nextStep() {
    if (this.canProceed() && this.step < 3) {
      this.step++;
      this.errorMessage = '';
    }
  }

  // =========================
  // 🔵 QCM HELPERS
  // =========================
  addQcmOption() {
    if (this.qcmOptions.length < 4) this.qcmOptions.push('');
  }

  removeQcmOption(index: number) {
    this.qcmOptions.splice(index, 1);
    if (this.jeu.reponse && !this.qcmOptions.includes(this.jeu.reponse)) {
      this.jeu.reponse = '';
    }
  }

  // =========================
  // 🟡 PUZZLE HELPERS
  // =========================
  toggleHiddenLetter(index: number) {
    const pos = this.hiddenPositions.indexOf(index);
    if (pos > -1) {
      this.hiddenPositions.splice(pos, 1);
    } else {
      this.hiddenPositions.push(index);
    }
    this.updatePuzzleData();
  }

  isHidden(index: number): boolean {
    return this.hiddenPositions.includes(index);
  }

  generatePuzzleFromWord() {
    if (!this.jeu.mot) return;
    this.hiddenPositions = [];
    this.updatePuzzleData();
  }

  updatePuzzleData() {
    const chars = this.jeu.mot?.split('') || [];
    this.jeu.motTroue = chars.map((c: string, i: number) => this.isHidden(i) ? '_' : c).join('');
    this.jeu.lettresManquantes = this.hiddenPositions.map(i => chars[i]).join(',');
    this.jeu.positionsCachees = JSON.stringify(this.hiddenPositions);
  }

  // =========================
  // 🟢 PHRASE HELPERS
  // =========================
  shufflePhrase() {
    if (!this.jeu.phraseOriginale) return;
    const mots = this.jeu.phraseOriginale.split(' ').filter((m: string) => m.trim());
    const melanges = mots.map((mot: string, id: number) => ({ id, mot }));
    for (let i = melanges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [melanges[i], melanges[j]] = [melanges[j], melanges[i]];
    }
    this.phrasePreview = melanges;
    this.jeu.motsMelanges = JSON.stringify(melanges);
  }

  // =========================
  // 🧠 MEMORY HELPERS
  // =========================
  isNumberSelected(n: number): boolean {
    return this.memoryCards.some(c => c.valeur === n && c.memoryType === 'number');
  }

  toggleNumber(n: number): void {
    const index = this.memoryCards.findIndex(c => c.valeur === n && c.memoryType === 'number');
    if (index > -1) {
      this.memoryCards.splice(index, 1);
    } else {
      this.memoryCards.push({ valeur: n, memoryType: 'number' });
    }
  }

  getValidWords(): any[] {
    return this.memoryCards.filter(c => c.valeur?.trim() && c.memoryType === 'word');
  }

  removeWordByIndex(index: number): void {
    const valid = this.getValidWords();
    const target = valid[index];
    const realIndex = this.memoryCards.findIndex(c => c === target);
    if (realIndex > -1) {
      this.memoryCards.splice(realIndex, 1);
    }
  }

  addMemoryPair(): void {
    this.memoryCards.push({ valeur: '', memoryType: 'word' });
  }

  isSelected(animal: any): boolean {
    return this.memoryCards.some(c => c.nom === animal.nom && c.memoryType === 'animal');
  }

  toggleAnimal(animal: any): void {
    const index = this.memoryCards.findIndex(c => c.nom === animal.nom && c.memoryType === 'animal');
    if (index > -1) {
      this.memoryCards.splice(index, 1);
    } else {
      this.memoryCards.push({ ...animal, memoryType: 'animal' });
    }
  }

  removeMemoryCard(index: number): void {
    this.memoryCards.splice(index, 1);
  }

  getPairCount(): number {
    return Math.floor(this.memoryCards.length / 2);
  }

  canValidate(): boolean {
    const validCards = this.memoryCards.filter(c => {
      if (this.jeu.memoryType === 'word') return c.valeur?.trim();
      return true;
    });
    return validCards.length >= 4;
  }

  validerMemory(): void {
    if (!this.canValidate()) return;

    this.memoryCards = this.memoryCards.filter(c => {
      if (this.jeu.memoryType === 'word') return c.valeur?.trim();
      return true;
    });

    this.jeu.cartes = JSON.stringify(this.memoryCards);

    this.successMessage = `✅ ${this.getPairCount()} paires validées !`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  onMemoryTypeChange(): void {
    this.memoryCards = [];
    if (this.jeu.memoryType === 'word') {
      this.memoryCards = [
        { valeur: '', memoryType: 'word' },
        { valeur: '', memoryType: 'word' }
      ];
    }
  }

  // =========================
  // 🔄 NAVIGATION & VALIDATION
  // =========================
  canProceed(): boolean {
    if (this.step === 1) {
      return !!(this.jeu.titre?.trim() && this.jeu.type && this.jeu.consigne?.trim());
    }
    if (this.step === 2) {
      if (this.jeu.type === 'qcm') {
        return !!(this.jeu.question?.trim() && this.qcmOptions.some(o => o.trim()) && this.jeu.reponse);
      }
      if (this.jeu.type === 'puzzle') {
        return !!(this.jeu.mot?.trim() && this.jeu.positionsCachees);
      }
      if (this.jeu.type === 'phrasejeux') {
        return !!(this.jeu.phraseOriginale?.trim() && this.jeu.motsMelanges);
      }
      if (this.jeu.type === 'memory') {
        const validCards = this.memoryCards.filter(c => {
          if (this.jeu.memoryType === 'word') return c.valeur?.trim();
          return true;
        });
        return validCards.length >= 4;
      }
      return false;
    }
    return true;
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.errorMessage = '';
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  // =========================
  // 🔄 RESET FORM
  // =========================
  resetForm() {
    this.jeu = {
      titre: '',
      type: '',
      niveau: '',
      consigne: '',
      difficulte: 'facile',
      prof: this.getProfFromLocalStorage(), // ✅ MODIF ICI AUSSI
      memoryType: 'number',

      question: '',
      options: '',
      reponse: '',

      mot: '',
      motTroue: '',
      lettresManquantes: '',
      positionsCachees: '',

      phraseOriginale: '',
      motsMelanges: '',

      cartes: '',
      typeMemory: 'images'
    };

    this.qcmOptions = ['', ''];
    this.memoryCards = [];
    this.phrasePreview = [];
    this.hiddenPositions = [];
  }

  setFocusStyle(event: Event) {
    const input = event.target as HTMLElement;
    input.classList.add('ring-2', 'ring-blue-400');
  }

  removeFocusStyle(event: Event) {
    const input = event.target as HTMLElement;
    input.classList.remove('ring-2', 'ring-blue-400');
  }
}