import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Cours } from '../../../../model/cours';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoursRefreshService } from '../../../../services/cours-refresh.service';

@Pipe({ name: 'filterTitre', standalone: true })
export class FilterTitrePipe implements PipeTransform {
  transform(cours: Cours[], prefixe: string): Cours[] {
    if (!cours || !prefixe) return cours || [];
    return cours.filter(c => !!c.titre && c.titre.startsWith(prefixe));
  }
}

@Component({
  selector: 'app-mescours-p',
  templateUrl: './mescours-p.html',
  styleUrls: ['./mescours-p.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterTitrePipe],
})
export class MescoursP implements OnInit, OnDestroy {
  @ViewChild('track', { static: false }) track!: ElementRef<HTMLDivElement>;

  cours: Cours[] = [];
  coursSelectionne: Cours | null = null;
  popupVisible = false;
  popupEditionVisible = false;
  coursAModifier: Cours = {} as Cours;
  fichierPdfModifie: File | null = null;
  pdfUrlSanitized: SafeResourceUrl | null = null;
  lienYoutubeModifie: string = '';

  // Champs pour gestion du préfixe / titre modifiable
  prefixeTitre: string = 'Cours :';
  titreSansPrefix: string = '';
  Math = Math;
  // Pagination
  pageCours: number = 1;
  pageExercices: number = 1;
  taillePage: number = 2;

  private refreshSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private refreshService: CoursRefreshService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chargerCoursProf();
    this.refreshSub = this.refreshService.refreshRequested$.subscribe(() => {
      this.chargerCoursProf();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  chargerCoursProf(): void {
    const nomProf = localStorage.getItem('nomProf');
    if (!nomProf) { this.cours = []; return; }
    this.http.get<Cours[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(nomProf)}`)
      .subscribe({
        next: data => this.cours = data || [],
        error: err => { console.error(err); this.cours = []; }
      });
  }

  // -------- Pagination --------
  getCoursParPage(prefixe: string, page: number): Cours[] {
    const filtres = this.cours.filter(c => !!c.titre && c.titre.startsWith(prefixe));
    const start = (page - 1) * this.taillePage;
    return filtres.slice(start, start + this.taillePage);
  }

  getNombrePages(prefixe: string): number {
    const filtres = this.cours.filter(c => !!c.titre && c.titre.startsWith(prefixe));
    return Math.max(1, Math.ceil(filtres.length / this.taillePage));
  }

  pagePrecedente(prefixe: string): void {
    if (prefixe === 'Cours :' && this.pageCours > 1) this.pageCours--;
    if (prefixe === 'Exercice :' && this.pageExercices > 1) this.pageExercices--;
  }

  pageSuivante(prefixe: string): void {
    if (prefixe === 'Cours :' && this.pageCours < this.getNombrePages('Cours :')) this.pageCours++;
    if (prefixe === 'Exercice :' && this.pageExercices < this.getNombrePages('Exercice :')) this.pageExercices++;
  }

  // -------- Popups & fichiers --------
  ouvrirPopup(cours: Cours): void {
    this.coursSelectionne = cours;
    this.popupVisible = true;
    if (cours.fichierPdf) {
      const url = `http://localhost:3000/uploads/${encodeURIComponent(cours.fichierPdf)}`;
      this.pdfUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else this.pdfUrlSanitized = null;
  }

  fermerPopup(): void {
    this.popupVisible = false;
    this.coursSelectionne = null;
    this.pdfUrlSanitized = null;
  }

  ouvrirPopupEdition(cours: Cours): void {
    // clone pour ne pas modifier l'original tant que l'utilisateur n'a pas validé
    this.coursAModifier = { ...cours };
    this.fichierPdfModifie = null;
    this.lienYoutubeModifie = cours.lienYoutube || '';

    // déterminer le préfixe et la partie modifiable du titre
    if (this.coursAModifier.titre?.startsWith('Exercice :')) {
      this.prefixeTitre = 'Exercice :';
      this.titreSansPrefix = this.coursAModifier.titre.replace(/^Exercice\s*:\s*/i, '').trim();
    } else if (this.coursAModifier.titre?.startsWith('Cours :')) {
      this.prefixeTitre = 'Cours :';
      this.titreSansPrefix = this.coursAModifier.titre.replace(/^Cours\s*:\s*/i, '').trim();
    } else {
      // si pas de préfixe connu, considère comme "Cours :"
      this.prefixeTitre = 'Cours :';
      this.titreSansPrefix = (this.coursAModifier.titre || '').trim();
    }

    this.popupEditionVisible = true;
  }

  fermerPopupEdition(): void {
    this.popupEditionVisible = false;
    this.coursAModifier = {} as Cours;
    this.fichierPdfModifie = null;
    this.titreSansPrefix = '';
    this.prefixeTitre = 'Cours :';
    this.lienYoutubeModifie = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.fichierPdfModifie = input.files[0];
  }

  validerModificationCours(): void {
    if (!this.coursAModifier?._id) return;

    // reconstruire le titre complet avec le préfixe figé
    const titreComplet = `${this.prefixeTitre} ${this.titreSansPrefix}`.trim();

    const formData = new FormData();
    formData.append('titre', titreComplet);
    formData.append('matiere', this.coursAModifier.matiere || '');
    formData.append('lienYoutube', this.lienYoutubeModifie || '');
    if (this.fichierPdfModifie) formData.append('fichierPdf', this.fichierPdfModifie);

    this.http.put(`http://localhost:3000/api/cours/${this.coursAModifier._id}`, formData)
      .subscribe({
        next: () => {
          this.fermerPopupEdition();
          this.refreshService.demanderRafraichissement();
        },
        error: err => console.error(err)
      });
  }

  supprimerCours(cours: Cours): void {
    if (!confirm(`Supprimer le cours "${cours.titre}" ?`)) return;
    this.http.delete(`http://localhost:3000/api/cours/${cours._id}`).subscribe({
      next: () => this.chargerCoursProf(),
      error: err => console.error(err)
    });
  }

  ouvrirLienYoutube(lien: string | null | undefined): void {
    if (lien) window.open(lien, '_blank');
  }

  telechargerFichier(nomFichier: string): void {
    const url = `http://localhost:3000/uploads/${encodeURIComponent(nomFichier)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getImageParMatiere(matiere: string): string {
    if (!matiere) return 'assets/img/default.jpg';
    switch (matiere.toLowerCase()) {
      case 'maths': return 'assets/coursmaths.png';
      case 'français': return 'assets/coursfrançais.png';
      case 'histoire': return 'assets/courshistoire.png';
      case 'sciences': return 'assets/sciences.png';
      default: return 'assets/img/default.jpg';
    }
  }
}
