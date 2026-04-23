import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../Backend/services/theme.service';
import { QRCodeComponent } from 'angularx-qrcode';

interface UserData {
  nom: string;
  prenom: string;
  role: string;
  key: string;
  equipe: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-relation-barre',
  standalone: true,
  imports: [
    CommonModule,
    QRCodeComponent
  ],
  templateUrl: './relation-barre.html',
  styleUrls: ['./relation-barre.css'],
})
export class Relationbarre implements OnInit, OnDestroy {

  user: UserData | null = null;
  showQR = false;
  isCopied = false;
  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    const userStorage = localStorage.getItem('utilisateur');
    if (userStorage) {
      const utilisateur = JSON.parse(userStorage);
      this.user = {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        role: utilisateur.role,
        key: utilisateur.key,
        equipe: utilisateur.equipe
      };
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.isCopied = true;
      if (this.copyTimeout) clearTimeout(this.copyTimeout);
      this.copyTimeout = setTimeout(() => this.isCopied = false, 2000);
    });
  }

  openQR(): void {
    this.showQR = true;
  }

  closeQR(): void {
    this.showQR = false;
  }

  ngOnDestroy(): void {
    if (this.copyTimeout) clearTimeout(this.copyTimeout);
  }

}