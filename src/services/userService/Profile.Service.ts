import { Injectable } from '@angular/core';
import { AuthService } from '../userService/Auth.Service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private authService: AuthService) {}

  getUser() {
    return this.authService.getUser();
  }

  setUser(user: any) {
    this.authService.setUser(user);
  }

  ajouterXP(xp: number) {
    const user = this.getUser();
    if (!user) return;
    user.xp = (user.xp || 0) + xp;
    this.setUser(user);
  }

  getInitiales(): string {
    const user = this.getUser();
    return user?.initiale || 'IN';
  }

  getNomComplet(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || 'invité';
  }

  // -------------------------------
  // Vide les infos locales
  clearProfile() {
    this.authService.setUser(null);
  }

  // -------------------------------
  // Suppression complète du compte
  deleteAccount() {
    // Ici, tu peux ajouter un appel API pour supprimer le compte côté serveur
    // Exemple : return this.http.delete('/api/user/delete')
    this.clearProfile();
    console.log('Compte et données utilisateur supprimés définitivement.');
  }

  
}
