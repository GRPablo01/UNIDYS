import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { Icon } from "../icon/icon";


interface SearchItem {
  title: string;
  type: 'Cours' | 'Jeu' | 'QCM' | 'Exercice' | string;
  image: string;
  description: string;
  imageLoaded?: boolean;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

   constructor(public themeService: ThemeService) {}

  searchText = '';
  suggestions: SearchItem[] = [];
  filteredSuggestions: SearchItem[] = [];
  isFocused = false;
  isLoading = false;
  hoverIndex: any = null;
  highlightedIndex = -1;
  selectedType: string | null = null;
  showRecentSearches = false;
  recentSearches: string[] = [];

  // Sample data (replace with API later)
  items: SearchItem[] = [
    {
      title: 'Cours de lecture avancée',
      type: 'Cours',
      image: 'assets/cours.jpg',
      description: 'Améliorer la compréhension et la vitesse de lecture',
      imageLoaded: true
    },
    {
      title: 'Jeu de mémoire visuelle',
      type: 'Jeu',
      image: 'assets/jeu.jpg',
      description: 'Exercice interactif de mémorisation d\'images',
      imageLoaded: true
    },
    {
      title: 'QCM orthographe difficile',
      type: 'QCM',
      image: 'assets/qcm.jpg',
      description: 'Testez vos connaissances en orthographe française',
      imageLoaded: true
    },
    {
      title: 'Exercice vocabulaire quotidien',
      type: 'Exercice',
      image: 'assets/exercice.jpg',
      description: 'Apprenez 10 nouveaux mots par jour',
      imageLoaded: true
    },
    {
      title: 'Cours de grammaire',
      type: 'Cours',
      image: 'assets/cours2.jpg',
      description: 'Les bases de la grammaire française',
      imageLoaded: true
    },
    {
      title: 'Jeu d\'association',
      type: 'Jeu',
      image: 'assets/jeu2.jpg',
      description: 'Reliez les mots et les images',
      imageLoaded: true
    }
  ];


hoverClear = false;

  get uniqueTypes(): string[] {
    return [...new Set(this.items.map(item => item.type))];
  }

  ngOnInit() {
    this.loadRecentSearches();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.w-full.max-w-2xl')) {
      this.showRecentSearches = false;
      this.suggestions = [];
    }
  }

  onFocus() {
    this.isFocused = true;
    this.showRecentSearches = true;
    if (this.searchText) {
      this.onSearchChange();
    }
  }

  onBlur() {
    // Delay to allow click events on suggestions to fire
    setTimeout(() => {
      this.isFocused = false;
    }, 200);
  }

  onSearchChange() {
    this.isLoading = true;
    this.highlightedIndex = -1;
    
    // Simulate API delay
    setTimeout(() => {
      if (!this.searchText.trim()) {
        this.suggestions = [];
        this.filteredSuggestions = [];
        this.isLoading = false;
        return;
      }

      const search = this.searchText.toLowerCase();
      this.suggestions = this.items.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
      
      this.applyTypeFilter();
      this.isLoading = false;
    }, 300);
  }

  filterByType(type: string) {
    this.selectedType = this.selectedType === type ? null : type;
    this.applyTypeFilter();
  }

  clearTypeFilter() {
    this.selectedType = null;
    this.applyTypeFilter();
  }

  private applyTypeFilter() {
    if (this.selectedType) {
      this.filteredSuggestions = this.suggestions.filter(item => item.type === this.selectedType);
    } else {
      this.filteredSuggestions = [...this.suggestions];
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredSuggestions.length - 1);
      this.scrollToHighlighted();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
      this.scrollToHighlighted();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex >= 0 && this.filteredSuggestions[this.highlightedIndex]) {
        this.selectItem(this.filteredSuggestions[this.highlightedIndex]);
      }
    } else if (event.key === 'Escape') {
      this.clearSearch();
      this.searchInput.nativeElement.blur();
    }
  }

  private scrollToHighlighted() {
    // Implementation for scrolling to highlighted item if needed
  }

  selectItem(item: SearchItem) {
    this.searchText = item.title;
    this.addToRecentSearches(item.title);
    this.suggestions = [];
    this.showRecentSearches = false;
    
    // Emit event or navigate
    console.log('Selected:', item);
    // this.router.navigate(['/item', item.id]);
  }

  clearSearch() {
    this.searchText = '';
    this.suggestions = [];
    this.filteredSuggestions = [];
    this.highlightedIndex = -1;
    this.selectedType = null;
    this.searchInput.nativeElement.focus();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    const item = this.items.find(i => i.image === img.src);
    if (item) {
      item.imageLoaded = false;
    }
    img.style.display = 'none';
  }

  // Recent Searches Management
  private loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      this.recentSearches = JSON.parse(saved);
    }
  }

  private saveRecentSearches() {
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches.slice(0, 10)));
  }

  private addToRecentSearches(query: string) {
    this.recentSearches = [query, ...this.recentSearches.filter(q => q !== query)].slice(0, 10);
    this.saveRecentSearches();
  }

  searchFromRecent(query: string) {
    this.searchText = query;
    this.onSearchChange();
    this.showRecentSearches = false;
  }

  removeRecentSearch(search: string, event: Event) {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter(s => s !== search);
    this.saveRecentSearches();
  }

  clearAllRecentSearches() {
    this.recentSearches = [];
    this.saveRecentSearches();
  }
}