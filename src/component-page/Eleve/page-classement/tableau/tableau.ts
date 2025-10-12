import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

interface Eleve {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  xp: number;
  level: number; // calculé à partir de l'XP
}

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.html',
  styleUrls: ['./tableau.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule]
})
export class Tableau implements OnInit, OnDestroy {
  eleves: Eleve[] = [];
  countdown: any = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private timerSubscription!: Subscription;
  private targetDate: number = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 1 an

  // ID de l'utilisateur connecté (à remplacer par la valeur réelle)
  currentUserId: string = 'ID_DE_LUTILISATEUR_CONNECTE';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupération des élèves
    this.http.get<Eleve[]>('http://localhost:3000/api/eleves').subscribe({
      next: (data) => {
        this.eleves = data
          .map(e => ({ 
            ...e, 
            level: Math.floor(e.xp / 100) // calcul du level
          }))
          .sort((a, b) => b.xp - a.xp);
      },
      error: (err) => console.error('Erreur récupération des élèves', err)
    });

    // Lancement du compteur
    this.timerSubscription = interval(1000).subscribe(() => this.updateCountdown());
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      this.eleves.forEach(eleve => eleve.xp = 0);
      this.eleves.forEach(eleve => eleve.level = 0);
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }
  }

  getLevelImage(level: number): string {
    switch(level) {
      case 0: return 'assets/Level-0.png';
      case 1: return 'assets/Level-1.png';
      case 2: return 'assets/Level-2.png';
      case 3: return 'assets/Level-3.png';
      case 4: return 'assets/Level-4.png';
      case 5: return 'assets/Level-5.png';
      case 6: return 'assets/Level-6.png';
      case 7: return 'assets/Level-7.png';
      case 8: return 'assets/Level-8.png';
      case 9: return 'assets/Level-9.png';
      case 10: return 'assets/Level-10.png';
      default: return 'assets/Level-0.png';
    }
  }
}
