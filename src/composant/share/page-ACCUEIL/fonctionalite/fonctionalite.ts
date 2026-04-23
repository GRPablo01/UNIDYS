import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, Renderer2  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { Theme } from '../../theme/theme';
import { ThemeService } from '../../../../../Backend/services/theme.service';


@Component({
  selector: 'app-fonctionalite',
  templateUrl: './fonctionalite.html',
  styleUrls: ['./fonctionalite.css'],
  imports: [CommonModule,RouterLink,Icon]
})
export class Fonctionalite implements OnInit { 
  steps: any[] = [];
  role: string = '';
  userName: string = '';

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
  theme: string = 'clair';
  xp: number = 0;

  // Propriétés style
  background: string = '';
  background2: string = '';
  text: string = '';
  rouge: string = '';
  pattern1: string = '';
  pattern2: string = '';


  Bleu0: string = '';
  Bleu1: string = '';
  Bleu2: string = '';
  BleuBG: string = '';
 

  Vert0: string = '';
  Vert1: string = '';
  Vert2: string = '';

  Rouge0: string = '';
  Rouge1: string = '';
  Rouge2: string = '';

  Orange0: string = '';
  Orange1: string = '';
  Orange2: string = '';
  

  Logo: string = '';
  bleuBg: string = '';
  bleuText: string = '';
  vertBg: string = '';
  vertText: string = '';

  constructor(private renderer: Renderer2,
    public themeService:ThemeService
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

    this.loadUserData();
  }

  private loadUserData(): void {
    const userString = localStorage.getItem('utilisateur');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.role = user.role || 'visiteur';
        this.userName = user.name || user.email || '';
      } catch (error) {
        console.error('Erreur parsing localStorage user:', error);
        this.role = 'visiteur';
      }
    } else {
      this.role = 'visiteur';
    }
    
    this.setupSteps();
  }

  private setupSteps(): void {
    const roleConfigs = {
      eleve: {
        title: 'Prêt à exceller dans tes cours ?',
        steps: [
          {
            icon: 'fa-solid fa-rocket',
            title: 'Commence ton aventure',
            description: 'Des milliers d\'élèves progressent chaque jour. Rejoins-les !',
            cta: 'Choisir mon premier cours',
            link: '/cours'  // <-- lien ajouté
          },
          {
            icon: 'fa-solid fa-trophy',
            title: 'Gagne des points',
            description: 'Transforme ton apprentissage en jeu et débloque des récompenses exclusives !',
            cta: 'Commencer à jouer',
            link: '/cours/jeu'
          },
          {
            icon: 'fa-solid fa-medal',
            title: 'Deviens le meilleur',
            description: 'Surpasse tes camarades et affiche fièrement ta progression à tes parents !',
            cta: 'Voir mon tableau de bord',
            link: '/dashboard'
          }
        ]
      },
      prof: {
        title: 'Transformez votre enseignement dès aujourd\'hui',
        steps: [
          {
            icon: 'fa-solid fa-magic',
            title: 'Créez en 5 minutes',
            description: 'Des outils puissants qui vous feront gagner 10h par semaine. Essayez-les maintenant !',
            cta: 'Créer mon premier cours',
            link: '/prof/creer-cours'
          },
          {
            icon: 'fa-solid fa-chart-bar',
            title: 'Suivez vos élèves',
            description: 'Identifiez instantanément les points bloquants et adaptez votre enseignement.',
            cta: 'Voir les statistiques',
            link: '/prof/statistiques'
          },
          {
            icon: 'fa-solid fa-users',
            title: 'Inspirez vos classes',
            description: 'Des résultats prouvés : +40% d\'engagement avec nos outils interactifs.',
            cta: 'Gérer mes classes',
            link: '/prof/classes'
          }
        ]
      },
      admin: {
        title: 'Pilotez votre plateforme efficacement',
        steps: [
          {
            icon: 'fa-solid fa-chart-line',
            title: 'Suivez les performances',
            description: 'Accédez aux statistiques en temps réel : utilisateurs, cours, progression et activité globale.',
            cta: 'Voir le dashboard',
            link: '/admin/dashboard'
          },
          {
            icon: 'fa-solid fa-users-gear',
            title: 'Gérez les utilisateurs',
            description: 'Administrez les comptes élèves, professeurs et rôles avec un contrôle total.',
            cta: 'Gérer les utilisateurs',
            link: '/admin/utilisateurs'
          },
          {
            icon: 'fa-solid fa-shield-halved',
            title: 'Sécurisez la plateforme',
            description: 'Contrôlez les accès, modérez les contenus et assurez la sécurité des données.',
            cta: 'Paramètres de sécurité',
            link: '/admin/securite'
          }
        ]
      }
    };
  
    const config = roleConfigs[this.role as keyof typeof roleConfigs] || roleConfigs.admin;
    this.steps = config.steps;
  }
  

  onStepClick(step: any, event: Event): void {
    const card = (event.target as HTMLElement).closest('.step-card');
    if (card) {
      card.classList.add('clicked');
      setTimeout(() => card.classList.remove('clicked'), 300);
    }
    console.log(`Navigation vers: ${step.cta}`);
  }

  getPersonalizedTitle(): string {
    if (this.role === 'eleve' && this.userName) {
      return `${this.userName}, prêt à briller demain ?`;
    }
    return this.getRoleConfig().title;
  }

  private getRoleConfig(): any {
    const configs = {
      eleve: { title: 'Prêt à exceller dans tes cours ?' },
      prof: { title: 'Transformez votre enseignement dès aujourd\'hui' },
      visiteur: { title: 'Rejoignez 100 000+ apprenants passionnés' }
    };
    return configs[this.role as keyof typeof configs] || configs.visiteur;
  }

  getSubtitle(): string {
    const subtitles = {
      eleve: 'Des outils conçus pour te faire aimer apprendre et réussir tes examens',
      prof: 'Des fonctionnalités puissantes pour engager vos élèves et simplifier votre travail',
      visiteur: 'La plateforme préférée des étudiants et enseignants en France'
    };
    return subtitles[this.role as keyof typeof subtitles] || subtitles.visiteur;
  }
}
