import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {
  userCount: number = 0;
  courseCount: number = 0;

  // Ajout des tableaux pour les rôles
  eleves: any[] = [];
  profs: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/unidys/users')
      .subscribe({
        next: users => {
          console.log("Réponse API Users:", users);
  
          // On ne garde que les 'eleve' et 'prof'
          const filteredUsers = Array.isArray(users) ? users.filter(u => u.role === 'eleve' || u.role === 'prof') : [];
  
          this.userCount = filteredUsers.length;
  
          // Filtrer séparément
          this.eleves = filteredUsers.filter(u => u.role === 'eleve');
          this.profs = filteredUsers.filter(u => u.role === 'prof');
        },
        error: err => console.error('Erreur API utilisateurs:', err)
      });
  
    // Récupération des cours
    this.http.get<any[]>('http://localhost:3000/api/unidys/cours')
      .subscribe({
        next: courses => {
          console.log("Réponse API Cours:", courses);
          this.courseCount = Array.isArray(courses) ? courses.length : 0;
        },
        error: err => console.error('Erreur API cours:', err)
      });
  }
}  
