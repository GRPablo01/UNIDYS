import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JeuService } from '../../../../../Backend/services/jeu.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../../Backend/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jeux2',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './jeux2.html',
  styleUrl: './jeux2.css',
})
export class Jeux2 implements OnInit {

  jeux: any[] = [];
  // ========== AJOUTER CES PROPRIÉTÉS ==========
  searchQuery: string = '';
  filterType: string | null = null;
  currentPage: number = 1;
  
  // Liste des types disponibles (à adapter selon tes données)
  typesJeu: string[] = ['qcm', 'memory', 'puzzle', 'phrasejeux'];
  filterTag: string = '';
  // ========== DONNÉES ==========

  
  // ========== ÉTAT UI ==========
  hoverCard: string | null = null;
  hoverBtn: string | null = null;

  itemsPerPage: number = 12; // 4 colonnes x 3 lignes
  sortBy: string = 'nom';
  
  // ========== FILTRES ==========

  selectedTypes: string[] = [];
  selectedDifficultes: string[] = [];
  
  // ========== LISTES PRÉDÉFINIES ==========
  difficultes: string[] = ['facile', 'moyen', 'difficile', 'expert'];
  
  // ========== GETTER: JEUX FILTRÉS ==========
  get filteredJeux(): any[] {
    let result = this.jeux.filter(jeu => {
      const matchSearch = !this.searchQuery || 
        jeu.nom?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        jeu.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchType = this.selectedTypes.length === 0 || 
        this.selectedTypes.includes(jeu.type);
      
      const matchDiff = this.selectedDifficultes.length === 0 || 
        this.selectedDifficultes.includes(jeu.difficulte);
      
      return matchSearch && matchType && matchDiff;
    });
    
    // Tri
    result.sort((a, b) => {
      switch(this.sortBy) {
        case 'nom': return a.nom?.localeCompare(b.nom);
        case 'type': return a.type?.localeCompare(b.type);
        case 'difficulte': return a.difficulte?.localeCompare(b.difficulte);
        default: return 0;
      }
    });
    
    return result;
  }
  
  // ========== GETTER: JEUX PAGINÉS ==========
  get paginatedJeux(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJeux.slice(start, start + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredJeux.length / this.itemsPerPage);
  }
  
  // ========== MÉTHODES FILTRES ==========
  toggleType(type: string): void {
    const idx = this.selectedTypes.indexOf(type);
    if (idx > -1) {
      this.selectedTypes.splice(idx, 1);
    } else {
      this.selectedTypes.push(type);
    }
    this.currentPage = 1;
  }
  
  toggleDifficulte(diff: string): void {
    const idx = this.selectedDifficultes.indexOf(diff);
    if (idx > -1) {
      this.selectedDifficultes.splice(idx, 1);
    } else {
      this.selectedDifficultes.push(diff);
    }
    this.currentPage = 1;
  }
  
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedTypes = [];
    this.selectedDifficultes = [];
    this.currentPage = 1;
    this.sortBy = 'nom';
  }
  
  hasActiveFilters(): boolean {
    return this.searchQuery !== '' || 
           this.selectedTypes.length > 0 || 
           this.selectedDifficultes.length > 0;
  }
  
  getCountByType(type: string): number {
    return this.jeux.filter(j => j.type === type).length;
  }
  
  // ========== PAGINATION ==========
  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
  }
  
  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  
  
  
  

  constructor(
    private jeuService: JeuService,
    private router: Router,
    public themeService:ThemeService,
  ) {}

  ngOnInit(): void {
    this.loadJeux();
  }

  loadJeux() {
    this.jeuService.getAllJeux().subscribe({
      next: (data) => {
        this.jeux = data;
        console.log('🎮 Jeux récupérés :', data);
      },
      error: (err) => {
        console.error('❌ Erreur récupération jeux', err);
      }
    });
  }

  // ✅ NAVIGATION DIFFERENTE SELON TYPE
  lancerJeu(jeu: any) {
    if (!jeu?._id) {
      console.error("ID du jeu manquant :", jeu);
      return;
    }
  
    switch (jeu.type) {
  
      case 'memory':   // ✅ AJOUT ICI
      case 'memoire':
        this.router.navigate(['/jeumemory', jeu._id]);
        break;
  
      case 'phrase':
      case 'phrasejeux':
        this.router.navigate(['/jeuphrase', jeu._id]);
        break;
  
      case 'puzzle':
        this.router.navigate(['/jeupuzzle', jeu._id]);
        break;
  
      case 'qcm':
        this.router.navigate(['/jeuqcm', jeu._id]);
        break;
  
      default:
        console.error("Type de jeu inconnu :", jeu.type);
        break;
    }
  }


  getJeuImage(jeu: any): string {

    // si image venant de la base existe
    if (jeu.image && jeu.image.trim() !== '') {
      return jeu.image;
    }
  
    // sinon image automatique selon type
    switch (jeu.type) {
  
      case 'memory':
      case 'memoire':
        return 'assets/jeux/ImageMemory.png';
  
      case 'phrase':
      case 'phrasejeux':
        return 'assets/jeux/phrase.jpg';
  
      case 'puzzle':
        return 'assets/jeux/ImagePuzzle.png';
  
      case 'qcm':
        return 'assets/jeux/qcm.jpg';
  
      default:
        return 'assets/jeux/default.jpg';
    }
  }

  formatMotTroue(mot: string): string {
    if (!mot) return '';

    return mot
      .split('')
      .map(char => char === '_' ? '▢' : char)
      .join(' ');
  }


  
  /* ───────── COULEURS HEADER PAR TYPE ───────── */
  
  getHeaderColor(type: string): string {
    switch (type) {
      case 'memoire':     return '#7C3AED';
      case 'phrase':
      case 'phrasejeux':  return '#22c55e';
      case 'puzzle':      return '#f97316';
      case 'qcm':         return '#2563EB';
      default:            return '#A0B0B8';
    }
  }
  
  /* ───────── COULEURS BOUTON PAR TYPE ───────── */
  
  getButtonColor(type: string): string {
    switch (type) {
      case 'memoire':     return '#7C3AED';
      case 'phrase':
      case 'phrasejeux':  return '#22c55e';
      case 'puzzle':      return '#f97316';
      case 'qcm':         return '#2563EB';
      default:            return '#555E66';
    }
  }
  
  getButtonHoverColor(type: string): string {
    switch (type) {
      case 'memoire':     return '#6D28D9';
      case 'phrase':
      case 'phrasejeux':  return '#16a34a';
      case 'puzzle':      return '#ea580c';
      case 'qcm':         return '#1D4ED8';
      default:            return '#374151';
    }
  }
  
  /* ───────── ICÔNES PAR TYPE ───────── */
  
  getTypeIcon(type: string): string {
    switch (type) {
      case 'memoire':     return 'fa-solid fa-brain';
      case 'phrase':
      case 'phrasejeux':  return 'fa-solid fa-pen-to-square';
      case 'puzzle':      return 'fa-solid fa-puzzle-piece';
      case 'qcm':         return 'fa-solid fa-circle-question';
      default:            return 'fa-solid fa-play';
    }
  }
  
  getButtonIcon(type: string): string {
    switch (type) {
      case 'memoire':     return 'fa-solid fa-brain';
      case 'phrase':
      case 'phrasejeux':  return 'fa-solid fa-pen-to-square';
      case 'puzzle':      return 'fa-solid fa-puzzle-piece';
      case 'qcm':         return 'fa-solid fa-circle-question';
      default:            return 'fa-solid fa-play';
    }
  }
  
  getLabel(type: string): string {
    switch (type) {
      case 'memoire':     return 'Jouer au jeu mémoire';
      case 'phrase':
      case 'phrasejeux':  return 'Construire la phrase';
      case 'puzzle':      return 'Faire le puzzle';
      case 'qcm':         return 'Lancer le QCM';
      default:            return 'Lancer le jeu';
    }
  }
  
  /* ───────── DIFFICULTÉ ───────── */
  
  getDifficulteIcon(diff: string): string {
    switch (diff) {
      case 'Facile':   return 'fa-solid fa-seedling';
      case 'Moyen':    return 'fa-solid fa-fire';
      case 'Difficile': return 'fa-solid fa-skull';
      default:         return 'fa-solid fa-circle';
    }
  }
  
  getDifficulteBg(diff: string): string {
    switch (diff) {
      case 'Facile':   return this.themeService.isDarkMode ? '#14532d' : '#dcfce7';
      case 'Moyen':    return this.themeService.isDarkMode ? '#713f12' : '#fef9c3';
      case 'Difficile': return this.themeService.isDarkMode ? '#7f1d1d' : '#fee2e2';
      default:         return this.themeService.isDarkMode ? '#1e293b' : '#f1f5f9';
    }
  }
  
  getDifficulteText(diff: string): string {
    switch (diff) {
      case 'Facile':   return this.themeService.isDarkMode ? '#86efac' : '#14532d';
      case 'Moyen':    return this.themeService.isDarkMode ? '#fde047' : '#713f12';
      case 'Difficile': return this.themeService.isDarkMode ? '#fca5a5' : '#7f1d1d';
      default:         return this.themeService.Textsecondaire;
    }
  }
  
  getDifficulteBorder(diff: string): string {
    switch (diff) {
      case 'Facile':   return this.themeService.isDarkMode ? '#22c55e' : '#86efac';
      case 'Moyen':    return this.themeService.isDarkMode ? '#eab308' : '#fde047';
      case 'Difficile': return this.themeService.isDarkMode ? '#ef4444' : '#fca5a5';
      default:         return this.themeService.isDarkMode ? '#334155' : '#e2e8f0';
    }
  }
}