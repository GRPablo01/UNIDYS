import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../../Backend/services/theme.service';

@Component({
  selector: 'app-creer-cours2',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './creer-cours2.html',
  styleUrl: './creer-cours2.css',
})
export class CreerCours2 implements OnInit {

  etape: number = 1;
  etapeMaxAtteinte: number = 1;
  totalEtapes: number = 6;
  isDragging: boolean = false;
  uploadProgress: number = 0;
  navigationLoading: boolean = false;
  coverLoaded: boolean = false;

  // ─── Étape 1 : Auteur ───
  nom: string = '';
  prenom: string = '';
  focusNom: boolean = false;
  focusPrenom: boolean = false;

  // ─── Étape 2 : Contenu ───
  titre: string = '';
  description: string = '';
  duree: number | null = null;
  focusTitre: boolean = false;
  focusDesc: boolean = false;
  focusDuree: boolean = false;

  // ─── Étape 3 : Classification ───
  matiere: string = 'francais';
  niveau: string = 'debutant';
  categorie: string = '';

  // ─── Étape 4 : Médias ───
  fichier: File | null = null;
  previewUrl: string | null = null;
  videoUrl: string = '';
  couleur: string = '#81ff90';

  notifMessage: string | null = null;
  notifTimeout: any;

  // ─── Étape 5 : Tags & Langue ───
  tags: string = '';
  langue: string = 'fr';
  coverUrl: string = '';
  focusTags: boolean = false;
  focusCover: boolean = false;
  tagsSuggestions: string[] = ['angular', 'typescript', 'web', 'mobile', 'design', 'backend'];

  // ─── UI ───
  loading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'warning' = 'warning';

  // ─── Erreurs ───
  erreurs: { [key: string]: string } = {};

  // ─── Données statiques ───
  niveaux = [
    { code: 'debutant', label: 'Débutant', icon: '🌱' },
    { code: 'intermediaire', label: 'Intermédiaire', icon: '🌿' },
    { code: 'avance', label: 'Avancé', icon: '🌳' }
  ];

  categories = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

  matieres = [
    { code: 'francais', label: 'Français', icon: '📖' },
    { code: 'mathematiques', label: 'Maths', icon: '🔢' },
    { code: 'histoire', label: 'Histoire', icon: '🏛️' },
    { code: 'geographie', label: 'Géo', icon: '🌍' },
    { code: 'sciences', label: 'Sciences', icon: '🔬' },
    { code: 'anglais', label: 'Anglais', icon: '🇬🇧' },
    { code: 'informatique', label: 'Info', icon: '💻' },
    { code: 'arts', label: 'Arts', icon: '🎨' },
    { code: 'eps', label: 'EPS', icon: '⚽' },
    { code: 'musique', label: 'Musique', icon: '🎵' },
    { code: 'autre', label: 'Autre', icon: '✨' }
  ];

  langues = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'Anglais', flag: '🇬🇧' },
    { code: 'es', label: 'Espagnol', flag: '🇪🇸' },
    { code: 'de', label: 'Allemand', flag: '🇩🇪' }
  ];

  // Stepper data
  steps = [
    { id: 1, label: 'Auteur' },
    { id: 2, label: 'Contenu' },
    { id: 3, label: 'Classement' },
    { id: 4, label: 'Médias' },
    { id: 5, label: 'Résumé' }
  ];

  getStepImage() {
    switch(this.etape) {
      case 1: return 'https://img.freepik.com/free-vector/flat-design-contact-form-template_23-2150877595.jpg';
      case 2: return 'https://img.freepik.com/free-vector/content-author-writing-creative-article-flat-vector-illustration_778687-2653.jpg';
      case 3: return 'https://thumbs.dreamstime.com/b/isometric-business-people-organize-document-files-folders-inside-computer-flat-d-isometric-business-people-organize-138915746.jpg';
      case 4: return 'https://static.vecteezy.com/system/resources/previews/001/257/170/non_2x/modern-flat-file-upload-design-concept-vector.jpg';
      default: return '';
    }
  }
  
  getStepTitle() {
    switch(this.etape) {
      case 1: return 'Informations personnelles';
      case 2: return 'Contenu du cours';
      case 3: return 'Classement';
      case 4: return 'Médias';
      default: return '';
    }
  }

  constructor(
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.message = '';
  }

  // ─── Navigation ───
  etapeSuivante() {
    const err = this.validerEtape();
    if (!err && this.etape < this.totalEtapes) {
      this.etape++;
      if (this.etape > this.etapeMaxAtteinte) {
        this.etapeMaxAtteinte = this.etape;
      }
      this.message = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (err) {
      this.message = err;
      this.messageType = 'warning';
    }
  }

  getProgressPercent(): number {
    if (this.totalEtapes <= 1) return 100;
    return ((this.etape - 1) / (this.totalEtapes - 1)) * 100;
  }

  etapePrecedente() {
    if (this.etape > 1) {
      this.etape--;
      this.message = '';
    }
  }

  allerEtape(n: number) {
    if (n <= this.etapeMaxAtteinte || !this.validerEtape()) {
      this.etape = n;
      this.message = '';
    }
  }

  // ─── Validation ───
  validerEtape(): string {
    this.erreurs = {};
    switch (this.etape) {
      case 1:
        if (!this.nom.trim()) this.erreurs['nom'] = 'Nom requis';
        if (!this.prenom.trim()) this.erreurs['prenom'] = 'Prénom requis';
        break;
      case 2:
        if (!this.titre.trim()) this.erreurs['titre'] = 'Titre requis';
        if (!this.description.trim()) this.erreurs['description'] = 'Description requise';
        if (!this.duree || this.duree < 1) this.erreurs['duree'] = 'Durée invalide';
        break;
      case 3:
        if (!this.matiere) this.erreurs['matiere'] = 'Matière requise';
        if (!this.niveau) this.erreurs['niveau'] = 'Niveau requis';
        break;
      case 4:
        if (!this.fichier && !this.videoUrl.trim()) {
          return 'Ajoutez un PDF ou une vidéo';
        }
        break;
    }
    return Object.keys(this.erreurs).length > 0 ? 'Vérifiez les champs' : '';
  }

  validerChamp(champ: string): void {
    this.erreurs[champ] = '';
    switch (champ) {
      case 'nom':
        if (!this.nom.trim()) this.erreurs['nom'] = 'Nom requis';
        break;
      case 'prenom':
        if (!this.prenom.trim()) this.erreurs['prenom'] = 'Prénom requis';
        break;
      case 'titre':
        if (!this.titre.trim()) this.erreurs['titre'] = 'Titre requis';
        break;
      case 'description':
        if (!this.description.trim()) this.erreurs['description'] = 'Description requise';
        break;
      case 'duree':
        if (!this.duree || this.duree < 1) this.erreurs['duree'] = 'Durée invalide';
        break;
      case 'videoUrl':
        if (this.videoUrl && !this.isValidUrl(this.videoUrl)) {
          this.erreurs['videoUrl'] = 'URL invalide';
        }
        break;
      case 'coverUrl':
        if (this.coverUrl && !this.isValidUrl(this.coverUrl)) {
          this.erreurs['coverUrl'] = 'URL invalide';
        }
        break;
    }
  }

  etapeEstValide(etape: number): boolean {
    switch (etape) {
      case 1: return !!(this.nom.trim() && this.prenom.trim());
      case 2: return !!(this.titre.trim() && this.description.trim() && this.duree && this.duree > 0);
      case 3: return !!(this.matiere && this.niveau);
      case 4: return !!(this.fichier || this.videoUrl.trim());
      case 5: return true;
      default: return false;
    }
  }

  get formulaireValide(): boolean {
    return !!(this.nom.trim() && this.prenom.trim() && this.titre.trim() && 
              this.description.trim() && this.duree && this.duree > 0 && 
              this.matiere && this.niveau && (this.fichier || this.videoUrl.trim()));
  }

  // ─── Fichier ───
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  handleFile(file: File) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      this.message = 'PDF uniquement';
      this.messageType = 'warning';
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      this.message = 'Fichier trop lourd (max 50 MB)';
      this.messageType = 'warning';
      return;
    }
    this.fichier = file;
    this.simulateUpload();
    this.message = '';
  }

  simulateUpload() {
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        setTimeout(() => this.uploadProgress = 0, 500);
      }
    }, 200);
  }

  removeFile() {
    this.fichier = null;
    this.previewUrl = null;
    this.uploadProgress = 0;
  }

  // ─── Drag & Drop ───
  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  // ─── Sélections ───
  selectionnerMatiere(code: string) {
    this.matiere = code;
    this.validerChamp('matiere');
  }

  selectionnerNiveau(code: string) {
    this.niveau = code;
    this.validerChamp('niveau');
  }

  // ─── Tags ───
  onTagsInput() {
    // Filtrer les suggestions
  }

  getTagList(): string[] {
    return this.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }

  removeTag(tag: string) {
    const tags = this.getTagList().filter(t => t !== tag);
    this.tags = tags.join(', ');
  }

  ajouterTag(tag: string) {
    const tags = this.getTagList();
    if (!tags.includes(tag)) {
      tags.push(tag);
      this.tags = tags.join(', ');
    }
  }

  // ─── Création ───
creerCours() {
  if (!this.formulaireValide) return;

  const formData = new FormData();
  formData.append('titre', this.titre.trim());
  formData.append('description', this.description.trim());
  formData.append('nom', this.nom.trim());
  formData.append('prenom', this.prenom.trim());
  formData.append('matiere', this.matiere);
  formData.append('niveau', this.niveau);
  formData.append('categorie', this.categorie);
  formData.append('tags', this.tags);
  formData.append('couleur', this.couleur);
  formData.append('langue', this.langue);
  formData.append('coverUrl', this.coverUrl.trim());

  if (this.duree) formData.append('duree', this.duree.toString());
  if (this.fichier) formData.append('pdf', this.fichier);
  if (this.videoUrl.trim()) formData.append('videoUrl', this.videoUrl.trim());

  this.loading = true;
  this.notifMessage = null;

  this.http.post('http://localhost:3000/api/cours', formData).subscribe({
    next: () => {
      this.notifMessage = 'Cours publié avec succès !';
      this.loading = false;
      
      // Auto-fermeture de la notif après 4 secondes
      clearTimeout(this.notifTimeout);
      this.notifTimeout = setTimeout(() => {
        this.notifMessage = null;
      }, 4000);
      
      // Reset du formulaire après un court délai
      setTimeout(() => this.resetForm(), 1500);
    },
    error: (err) => {
      this.notifMessage = 'Erreur : ' + (err.error?.message || 'Publication impossible');
      this.loading = false;
      
      // Auto-fermeture de la notif erreur après 5 secondes
      clearTimeout(this.notifTimeout);
      this.notifTimeout = setTimeout(() => {
        this.notifMessage = null;
      }, 5000);
    }
  });
}

  resetForm() {
    this.etape = 1;
    this.etapeMaxAtteinte = 1;
    this.nom = '';
    this.prenom = '';
    this.titre = '';
    this.description = '';
    this.duree = null;
    this.matiere = 'francais';
    this.niveau = 'debutant';
    this.categorie = '';
    this.fichier = null;
    this.previewUrl = null;
    this.videoUrl = '';
    this.couleur = '#81ff90';
    this.tags = '';
    this.langue = 'fr';
    this.coverUrl = '';
    this.message = '';
    this.loading = false;
    this.erreurs = {};
    this.uploadProgress = 0;
    this.coverLoaded = false;
  }

  // ─── Helpers ───
  getNiveauLabel(code: string): string {
    return this.niveaux.find(n => n.code === code)?.label || '';
  }

  getMatiereLabel(code: string): string {
    return this.matieres.find(m => m.code === code)?.label || '';
  }

  getEtapeLabel(i: number): string {
    const labels = ['Auteur', 'Contenu', 'Classe', 'Médias', 'Tags', 'Résumé'];
    return labels[i - 1] || '';
  }

  getVideoTitle(): string {
    if (!this.videoUrl) return '';
    try {
      const url = new URL(this.videoUrl);
      if (url.hostname.includes('youtube')) return 'YouTube';
      if (url.hostname.includes('vimeo')) return 'Vimeo';
      return 'Vidéo';
    } catch {
      return 'Vidéo';
    }
  }

  onCoverError() {
    this.coverLoaded = false;
    this.erreurs['coverUrl'] = 'Image invalide';
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  peutNaviguerVers(etape: number): boolean {
    return etape <= this.etapeMaxAtteinte;
  }
}