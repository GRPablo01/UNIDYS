import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Cours {
  _id: string;
  titre: string;
  description: string;
  niveau: string;
  matiere: string;
  professeur?: string;
  imageMatiere?: string;
  lienYoutube?: string;
}

@Component({
  selector: 'app-liste-cours',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './liste-cours-a.html',
  styleUrls: ['./liste-cours-a.css']
})
export class ListeCoursA implements OnInit {
  cours: Cours[] = [];
  coursGroupedByProf: { [professeur: string]: Cours[] } = {};
  showEditModal = false;
  isSaving = false;

  Object = Object; // Pour Object.keys() dans le template

  // Pour gérer ouverture/fermeture des dossiers
  dossierOuvert: { [professeur: string]: boolean } = {};

  selectedCours: Cours = {
    _id: '',
    titre: '',
    description: '',
    niveau: '',
    matiere: '',
    professeur: '',
    imageMatiere: '',
    lienYoutube: ''
  };

  // Modal des dossiers
  modalProfOuvert: boolean = false;
  profSelectionneModal: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCours();
  }

  loadCours(): void {
    this.http.get<any[]>('http://localhost:3000/api/unidys/cours')
      .subscribe({
        next: data => {
          const arr = Array.isArray(data) ? data : [];
          this.cours = arr.map((c: any) => {
            const professeur = c.professeur ?? c.nomProf ?? 'Inconnu';
            const imageMatiere = c.imageMatiere ?? this.getImageParMatiere(c.matiere || '');
            return { ...c, professeur, imageMatiere } as Cours;
          });
          this.groupCoursByProf();
        },
        error: err => console.error('Erreur API cours:', err)
      });
  }

  private groupCoursByProf(): void {
    this.coursGroupedByProf = this.cours.reduce((acc, c) => {
      const prof = c.professeur || 'Inconnu';
      if (!acc[prof]) acc[prof] = [];
      acc[prof].push(c);
      return acc;
    }, {} as { [professeur: string]: Cours[] });
  }

  // Ouvrir/fermer un dossier inline
  toggleDossier(prof: string) {
    this.dossierOuvert[prof] = !this.dossierOuvert[prof];
  }

  deleteCours(coursId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
    this.http.delete(`http://localhost:3000/api/unidys/cours/${coursId}`)
      .subscribe({
        next: () => {
          this.cours = this.cours.filter(c => c._id !== coursId);
          this.groupCoursByProf();
          console.log('Cours supprimé avec succès');
        },
        error: err => console.error('Erreur lors de la suppression:', err)
      });
  }

  editCours(cours: Cours): void {
    this.selectedCours = { ...cours };
    this.showEditModal = true;
  }

  closeEditModal(): void {  // Renommé pour éviter conflit
    this.showEditModal = false;
  }

  updateCours(): void {
    if (!this.selectedCours._id || this.isSaving) return;

    const payload: any = { ...this.selectedCours };
    if (payload.professeur) payload.nomProf = payload.professeur;
    delete payload.professeur;
    delete payload._id;

    this.isSaving = true;
    this.http.put<any>(`http://localhost:3000/api/unidys/cours/${this.selectedCours._id}`, payload)
      .subscribe({
        next: resp => {
          const updated: any = resp?.cours ?? resp;
          const normalized: Cours = {
            ...updated,
            professeur: updated.professeur ?? updated.nomProf ?? this.selectedCours.professeur,
            imageMatiere: updated.imageMatiere ?? this.getImageParMatiere(updated.matiere || '')
          };
          this.cours = this.cours.map(c => c._id === normalized._id ? normalized : c);
          this.groupCoursByProf();
          this.isSaving = false;
          this.closeEditModal();
          console.log('Cours mis à jour avec succès');
        },
        error: err => {
          this.isSaving = false;
          console.error('Erreur lors de la modification:', err);
          alert('❌ Erreur lors de la modification du cours.');
        }
      });
  }

  getImageParMatiere(matiere: string): string {
    switch ((matiere || '').toLowerCase()) {
      case 'maths': return 'assets/coursmaths.png';
      case 'français': return 'assets/coursfrançais.png';
      case 'histoire': return 'assets/courshistoire.png';
      case 'sciences': return 'assets/sciences.png';
      default: return 'assets/img/default.jpg';
    }
  }

  trackById(_index: number, item: Cours) { return item._id; }

  // Modal des dossiers du prof
  openProfModal(prof: string) {
    this.profSelectionneModal = prof;
    this.modalProfOuvert = true;
  }

  closeProfModal() {
    this.modalProfOuvert = false;
    this.profSelectionneModal = '';
  }
}
