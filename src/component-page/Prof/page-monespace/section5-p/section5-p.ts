import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CoursRefreshService } from '../../../../services/cours-refresh.service';
import { Icon } from '../../../../component/icon/icon';
import { ProfileService } from '../../../../services/userService/Profile.Service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


interface Cours {
  _id: string;
  titre: string;
  niveau: string;
  matiere: string;
  nomProf: string;
  lienYoutube?: string;
  fichierPdf?: string;
  qcms?: Qcm[];
}

interface Qcm {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
  xpMin?: number;
  xpMax?: number;
}

@Component({
  selector: 'app-section5-p',
  templateUrl: './section5-p.html',
  styleUrls: ['./section5-p.css'],
  standalone: true,
  imports: [Icon, FormsModule, CommonModule, RouterLink]
})
export class Section5P implements OnInit, OnDestroy {

  cours: Cours[] = [];

  popupCoursOuvert = false;
  popupQcmOuvert = false;
  popupOuvert = false;
  showPopupExplique = false;

  coursSelectionne: Cours | null = null;
  fichierPdf?: File;
  messageErreurPdf = '';
  niveau  = '';
  matiere = '';
  lienYoutube = '';
  imageMatiere = '';
  qcms: Qcm[] = [];
  bonneReponse: boolean[] = [false, false]; // initialisé avec deux réponses par défaut
  nouvelleQuestion = '';
  nouvellesReponses: string[] = ['', ''];
// Initialisation du type de contenu
typeDeContenu: 'cours' | 'exercice' = 'cours';
titreCours: string = 'Cours : ';

// Fonction pour changer le type et mettre à jour le préfixe
changerType(type: 'cours' | 'exercice') {
  this.typeDeContenu = type;

  // Assurer que le préfixe est toujours correct
  const prefixe = type === 'cours' ? 'Cours : ' : 'Exercice : ';

  // Supprimer l'ancien préfixe si présent
  if (this.titreCours.startsWith('Cours : ')) {
    this.titreCours = this.titreCours.replace('Cours : ', '');
  }
  if (this.titreCours.startsWith('Exercice : ')) {
    this.titreCours = this.titreCours.replace('Exercice : ', '');
  }

  // Ajouter le nouveau préfixe
  this.titreCours = prefixe + this.titreCours;
}

// Empêcher la suppression du préfixe
verifierPrefixe(event: KeyboardEvent) {
  const pos = (event.target as HTMLInputElement).selectionStart || 0;
  const prefixLength = this.typeDeContenu === 'cours' ? 'Cours : '.length : 'Exercice : '.length;

  if ((event.key === 'Backspace' && pos <= prefixLength) || (event.key === 'Delete' && pos < prefixLength)) {
    event.preventDefault();
  }

  setTimeout(() => {
    const prefixe = this.typeDeContenu === 'cours' ? 'Cours : ' : 'Exercice : ';
    if (!this.titreCours.startsWith(prefixe)) {
      this.titreCours = prefixe + this.titreCours;
    }
  }, 0);
}

  
  xpMin = 10;
  xpMax = 50;

  prenom = '';
  nom = '';
  avisMessage = '';
  nomProf = '';
  windowHeight: number = window.innerHeight;

  private refreshSub!: Subscription;

  constructor(
    private http: HttpClient,
    private refreshService: CoursRefreshService,
    private profileService: ProfileService
  ) {
    // Préremplir depuis le profil connecté
    const user = this.profileService.getUser();
    this.prenom = user?.prenom || '';
    this.nom = user?.nom || '';
  }

  ngOnInit(): void {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    if (!utilisateur.prenom || !utilisateur.nom) return;
    this.nomProf = `${utilisateur.prenom} ${utilisateur.nom}`.trim();
    this.chargerCours();
    this.refreshSub = this.refreshService.refreshRequested$.subscribe(() => this.chargerCours());
  
    // Initialisation de windowHeight
    this.windowHeight = window.innerHeight;
  
    // Écouteur pour mettre à jour windowHeight au redimensionnement
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight;
    });
  }
  

  ngOnDestroy(): void { this.refreshSub?.unsubscribe(); }

  chargerCours(): void {
    this.http.get<Cours[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(this.nomProf)}`)
      .subscribe({
        next: data => this.cours = data || [],
        error: err => { console.error(err); this.cours = []; }
      });
  }

  ouvrirPopupCours(cours?: Cours) {
    if (cours) {
      this.coursSelectionne = { ...cours };
      this.titreCours = cours.titre;
      this.niveau = cours.niveau;
      this.matiere = cours.matiere;
      this.lienYoutube = cours.lienYoutube || '';
      this.imageMatiere = this.getImageParMatiere(cours.matiere);
      this.qcms = cours.qcms || [];
    }
    this.popupCoursOuvert = true;
  }

  fermerPopupCours() { this.popupCoursOuvert = false; this.resetForm(); }

  resetForm() {
    this.titreCours = '';
    this.niveau = '';
    this.matiere = '';
    this.lienYoutube = '';
    this.imageMatiere = '';
    this.fichierPdf = undefined;
    this.qcms = [];
    this.coursSelectionne = null;
    this.nouvelleQuestion = '';
    this.nouvellesReponses = ['', ''];
    this.xpMin = 10;
    this.xpMax = 50;
  }

  onPdfSelected(event: any) {
    const fichier = event.target.files[0];
    if (fichier?.type === 'application/pdf') {
      this.fichierPdf = fichier;
      this.messageErreurPdf = '';
    } else {
      this.messageErreurPdf = 'Seuls les fichiers PDF sont autorisés.';
      this.fichierPdf = undefined;
      event.target.value = '';
    }
  }

  validerCours() {
    if (!this.titreCours || !this.niveau || !this.matiere || !this.fichierPdf) {
      alert('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    if (!utilisateur._id) return;

    const formData = new FormData();
    formData.append('utilisateurId', utilisateur._id);
    formData.append('nomProf', this.nomProf);
    formData.append('titre', this.titreCours);
    formData.append('niveau', this.niveau);
    formData.append('matiere', this.matiere);
    formData.append('lienYoutube', this.lienYoutube || '');
    formData.append('pdf', this.fichierPdf);
    if (this.qcms.length > 0) formData.append('qcms', JSON.stringify(this.qcms));

    this.http.post('http://localhost:3000/api/cours', formData).subscribe({
      next: () => { 
        alert('Cours créé avec succès !'); 
        this.fermerPopupCours(); 
        this.refreshService.demanderRafraichissement();
      },
      error: err => { console.error(err); alert('Erreur lors de la création du cours.'); }
    });
  }

  supprimerCours(cours: Cours) {
    if (!confirm(`Supprimer le cours "${cours.titre}" ?`)) return;
    this.http.delete(`http://localhost:3000/api/cours/${cours._id}`)
      .subscribe({ next: () => this.chargerCours(), error: err => console.error(err) });
  }

  getImageParMatiere(matiere: string): string {
    const images: Record<string, string> = { 
      'Français':'assets/coursfrançais.png',
      'Maths':'assets/coursmaths.png',
      'Histoire':'assets/courshistoire.png',
      'Sciences':'assets/sciences.png' 
    };
    return images[matiere] || 'assets/img/default.jpg';
  }

  ouvrirPopupQCM() {
    this.popupQcmOuvert = true;
    this.nouvelleQuestion = '';
    this.nouvellesReponses = ['', ''];
    this.bonneReponse = [false, false]; // <-- réinitialisation des bonnes réponses
    this.xpMin = 10;
    this.xpMax = 50;
  }
  

  // Déclaration de la propriété activeTab
  activeTab: 'cours' | 'qcm' | 'autre' = 'cours'; // Valeur par défaut

  fermerPopupexplique() {
    this.showPopupExplique = false;
  }
  

  fermerPopupQCM() { this.popupQcmOuvert = false; }

  ajouterReponsePopup() { this.nouvellesReponses.push(''); }
  supprimerReponsePopup(index: number) { this.nouvellesReponses.splice(index, 1); }

  validerQCM() {
    if (!this.nouvelleQuestion || this.nouvellesReponses.length < 2) {
      alert('Ajoutez une question et au moins 2 réponses.');
      return;
    }
    if (this.xpMin > this.xpMax) { 
      alert('XP min ne peut être supérieur à XP max'); 
      return; 
    }
  
    // Trouver l’index de la réponse correcte
    const indexBonneReponse = this.bonneReponse.findIndex(b => b === true);
    if (indexBonneReponse === -1) {
      alert("Sélectionnez une bonne réponse !");
      return;
    }
  
    this.qcms.push({
      question: this.nouvelleQuestion,
      reponses: [...this.nouvellesReponses],
      bonneReponse: indexBonneReponse,  // <-- ici le prof choisit
      xp: this.xpMin,
      xpMin: this.xpMin,
      xpMax: this.xpMax
    });
  
    this.fermerPopupQCM();
  }
  

  trackByIndex(index: number) { return index; }

  ouvrirPopup() { this.popupOuvert = true; }
  fermerPopup() { this.popupOuvert = false; }

  validerAvis() {
    if(!this.prenom || !this.nom || !this.avisMessage){ alert('Remplissez tous les champs'); return; }
    alert(`Merci pour votre avis, ${this.prenom} ${this.nom} !`);
    this.prenom=''; this.nom=''; this.avisMessage=''; this.popupOuvert=false;
  }

  mettreAJourImage() { this.imageMatiere = this.getImageParMatiere(this.matiere); }

  ouvrirPopupexplique() { this.showPopupExplique = true; }
  

  getInitiales() { return this.profileService.getInitiales(); }
  getNomComplet() { return this.profileService.getNomComplet(); }

  incrementXp() {
    if (this.xpMax < 50) this.xpMax++;
    if (this.xpMin < this.xpMax) this.xpMin++;
  }

  decrementXp() {
    if (this.xpMin > 10) this.xpMin--;
    if (this.xpMax > this.xpMin) this.xpMax--;
  }

  ouvrirQCMDepuisCours() {
    this.ouvrirPopupQCM();
  }
  choisirBonneReponse(index: number) {
    this.bonneReponse = this.nouvellesReponses.map((_, j) => j === index);
  }
  toggleBonneReponse(i: number) {
    this.bonneReponse[i] = !this.bonneReponse[i];
  }
  
}
