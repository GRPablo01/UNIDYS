import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Icon } from "../../icon/icon";

interface Etape {
  titre: string;
  texte: string;
  icone: string;
}

interface ParcoursRole {
  titre: string;
  etapes: Etape[];
}

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.html',
  styleUrls: ['./comment.css'],
  standalone: true,
  imports: [CommonModule, Icon],
})
export class Comment {

  // ─────────────── POPUP & NAVIGATION ───────────────
  showPopup: boolean = false;
  selectedRole: 'eleve' | 'prof' | 'parent' | null = null;
  currentStep: number = 0;

  // ─────────────── UTILISATEUR ───────────────
  nom: string = '';
  prenom: string = '';
  initiales: string = '';

  // ─────────────── THÈME & COULEURS ───────────────
  theme: 'clair' | 'sombre' = 'clair';
  text = '';
  texte = '';
  titre = '';
  header = '';
  rouge = '';
  background = '';
  background2 = '';
  Logo = '';
  Forme = '';

  Bleuclair: string = '';
  Orangeclair: string = '';
  Or: string = '';
  Maron: string = '';
  RougeFonce: string = '';

  hoverBtn: boolean = false;

  // ─────────────── PARCOURS ───────────────
  parcours: Record<'eleve' | 'prof' | 'parent', ParcoursRole> = {
    eleve: {
      titre: "Ce que peut faire un élève sur UniDys",
      etapes: [
        { titre: "Accéder aux cours", texte: "L'élève peut accéder à tous ses cours, avec un affichage clair et lisible, adapté aux dyslexiques.", icone: "fa-solid fa-book-open" },
        { titre: "S’auto-évaluer", texte: "Il peut répondre aux QCM interactifs pour s'auto-évaluer et identifier ses points forts et ses difficultés.", icone: "fa-solid fa-clipboard-check" },
        { titre: "Suivre sa progression", texte: "L'élève peut suivre sa progression grâce à un tableau de bord qui indique ses résultats et son évolution.", icone: "fa-solid fa-chart-line" },
        { titre: "Outils pédagogiques", texte: "Toutes les fonctionnalités sont conçues pour faciliter la lecture, la compréhension et la mémorisation.", icone: "fa-solid fa-lightbulb" }
      ]
    },
    prof: {
      titre: "Ce que peut faire un professeur sur UniDys",
      etapes: [
        { titre: "Créer et gérer ses cours", texte: "Le professeur peut créer et gérer ses cours avec des outils simples et intuitifs.", icone: "fa-solid fa-chalkboard-teacher" },
        { titre: "Ajouter et corriger les QCM", texte: "Il peut ajouter des QCM, corriger automatiquement ou manuellement les réponses des élèves.", icone: "fa-solid fa-pen-to-square" },
        { titre: "Suivi des élèves", texte: "Le professeur peut suivre en temps réel la progression de chaque élève et identifier rapidement ceux qui ont besoin d'aide.", icone: "fa-solid fa-chart-bar" },
        { titre: "Communication", texte: "Il peut communiquer directement avec les parents et les élèves via la plateforme pour un suivi personnalisé.", icone: "fa-solid fa-comments" }
      ]
    },
    parent: {
      titre: "Ce que peut faire un parent sur UniDys",
      etapes: [
        { titre: "Suivre l’enfant", texte: "Le parent peut consulter facilement les résultats et la progression de son enfant.", icone: "fa-solid fa-user-check" },
        { titre: "Notifications importantes", texte: "Il reçoit des notifications sur les performances et les activités importantes.", icone: "fa-solid fa-chart-line" },
        { titre: "Communication avec le professeur", texte: "Le parent peut communiquer avec le professeur pour poser des questions ou obtenir des conseils.", icone: "fa-solid fa-envelope" },
        { titre: "Visibilité complète", texte: "Toutes les informations sont présentées de manière claire, afin de suivre l'apprentissage de l'enfant sans confusion.", icone: "fa-solid fa-eye" }
      ]
    }
  };

  // ─────────────── MÉTHODES UTILITAIRES ───────────────
  private getInitiales(nom: string, prenom: string): string {
    return `${prenom.charAt(0) || ''}${nom.charAt(0) || ''}`.toUpperCase();
  }

  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      try {
        const user: Utilisateur = JSON.parse(storedUser);
        this.nom = user.nom || '';
        this.prenom = user.prenom || '';
        this.initiales = this.getInitiales(this.nom, this.prenom);
        this.theme = user.theme === 'sombre' || user.theme === 'clair' ? user.theme : 'clair';
      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
        this.theme = 'clair';
      }
    }
    this.setThemeColors();
  }

  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.text = '#FFFFFF'; this.texte = '#E6F2EE'; this.titre = '#FFFFFF';
      this.background = '#0E2F26'; this.background2 = '#15483b'; this.header = '#044629';
      this.rouge = '#b80000';
      this.Bleuclair = '#4A6C7A'; this.Orangeclair = '#B5723C';
      this.Or = '#A57C36'; this.RougeFonce = '#A03B2B'; this.Maron = '#7A2E17';
      this.Logo = 'assets/IconBlanc.svg'; this.Forme = 'assets/formeclair.png';
    } else {
      this.text = '#000000'; this.texte = '#044629'; this.titre = '#044629';
      this.background = '#F6F7F8'; this.background2 = '#b1b2b2'; this.header = '#B3E0F2';
      this.rouge = '#9b0202';
      this.Bleuclair = '#B3E0F2'; this.Orangeclair = '#D9965B';
      this.Or = '#D9AD5B'; this.RougeFonce = '#592B1B'; this.Maron = '#CD5320';
      this.Logo = 'assets/IconBlack.svg'; this.Forme = 'assets/formeclair.png';
    }
  }

  // ─────────────── POPUP ───────────────
  openPopup(role: 'eleve' | 'prof' | 'parent') {
    this.selectedRole = role;
    this.currentStep = 0;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedRole = null;
  }

  nextStep() {
    if (this.selectedRole && this.currentStep < this.parcours[this.selectedRole].etapes.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.selectedRole && this.currentStep > 0) {
      this.currentStep--;
    }
  }

  constructor() {
    this.loadUserInfo();
  }
}
