import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Icon } from '../../../../component/icon/icon';
import { ProfileService } from '../../../../services/userService/Profile.Service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-section5-e',
  templateUrl: './section5-e.html',
  styleUrls: ['./section5-e.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, Icon, HttpClientModule, RouterLink],
})
export class Section5E {
  popupOuvert = false;

  prenom: string = '';
  nom: string = '';
  avisMessage: string = '';

  constructor(
    public profileService: ProfileService,
    private http: HttpClient
  ) {
    // Préremplir depuis le profil connecté
    const user = this.profileService.getUser();
    this.prenom = user?.prenom || '';
    this.nom = user?.nom || '';
  }

  ouvrirPopup() {
    this.popupOuvert = true;
    // Recharger les infos utilisateur si besoin
    const user = this.profileService.getUser();
    this.prenom = user?.prenom || '';
    this.nom = user?.nom || '';
    this.avisMessage = '';
  }

  fermerPopup() {
    this.popupOuvert = false;
    this.avisMessage = '';
  }

  validerAvis() {
    if (!this.prenom.trim() || !this.nom.trim() || !this.avisMessage.trim()) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const motsInterdits = ['con', 'merde', 'idiot', 'nul', 'putain'];
    const contientInsulte = motsInterdits.some((mot) =>
      this.avisMessage.toLowerCase().includes(mot)
    );

    if (contientInsulte) {
      alert("Ton message contient des mots inappropriés. Merci de reformuler.");
      return;
    }

    const avis = {
      prenom: this.prenom,
      nom: this.nom,
      message: this.avisMessage,
    };

    this.http.post('http://localhost:3000/api/avis', avis)
      .pipe(
        catchError(err => {
          alert('Erreur lors de l\'envoi de l\'avis.');
          console.error(err);
          return throwError(() => err);
        })
      )
      .subscribe(() => {
        alert('Merci pour ton avis !');
        this.fermerPopup();
      });
  }

  getInitiales() { return this.profileService.getInitiales(); }
  getNomComplet() { return this.profileService.getNomComplet(); }

}
