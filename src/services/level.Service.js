// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class LevelService {
//   private xp: number = 0; // Points d'expérience actuels
//   private level: number = 1; // Niveau actuel
//   private readonly xpPerLevel: number = 100; // XP nécessaire par niveau

//   // Observable pour notifier les changements
//   private levelSubject = new BehaviorSubject<number>(this.level);
//   level$ = this.levelSubject.asObservable();

//   private xpSubject = new BehaviorSubject<number>(this.xp);
//   xp$ = this.xpSubject.asObservable();

//   constructor() {
//     this.loadProgress();
//   }

//   // Getters
//   get currentLevel(): number {
//     return this.level;
//   }

//   get currentXp(): number {
//     return this.xp;
//   }

//   get xpNeededForNextLevel(): number {
//     return this.xpPerLevel - this.xp;
//   }

//   // Ajouter de l'XP
//   addXp(gained: number): void {
//     if (gained <= 0) return;

//     this.xp += gained;

//     while (this.xp >= this.xpPerLevel) {
//       this.xp -= this.xpPerLevel;
//       this.level++;
//       this.levelSubject.next(this.level);
//     }

//     this.xpSubject.next(this.xp);
//     this.saveProgress();
//   }

//   // Réinitialiser le niveau et l'XP
//   reset(): void {
//     this.xp = 0;
//     this.level = 1;
//     this.levelSubject.next(this.level);
//     this.xpSubject.next(this.xp);
//     this.saveProgress();
//   }

//   // Sauvegarde dans localStorage
//   private saveProgress(): void {
//     localStorage.setItem('level', this.level.toString());
//     localStorage.setItem('xp', this.xp.toString());
//   }

//   // Chargement depuis localStorage
//   private loadProgress(): void {
//     const savedLevel = localStorage.getItem('level');
//     const savedXp = localStorage.getItem('xp');

//     if (savedLevel) this.level = parseInt(savedLevel, 10);
//     if (savedXp) this.xp = parseInt(savedXp, 10);

//     this.levelSubject.next(this.level);
//     this.xpSubject.next(this.xp);
//   }
// }
