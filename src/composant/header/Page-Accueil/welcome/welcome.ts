import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'], // corrige "styleUrl" en "styleUrls"
})
export class Welcome implements OnInit {

  nom: string = '';
  prenom: string = '';
  initiales: string = '';

  theme: 'clair' | 'sombre' = 'clair';
  text = '';
  rouge = '';
  background = '';

  bgblue = ''; bggreen = ''; bgpurple = ''; bgpink = ''; bgyellow = '';
  textblue = ''; textgreen = ''; textpurple = ''; textpink = ''; textyellow = '';

  Logo = '';

  ngOnInit(): void {
    // Récupérer les données depuis le localStorage
    const userStr = localStorage.getItem('utilisateur'); // on suppose que l'user est stocké sous forme JSON
    if (userStr) {
      const user = JSON.parse(userStr);
      this.nom = user.nom || '';
      this.prenom = user.prenom || '';
      this.initiales = this.getInitiales(this.nom, this.prenom);
    }
  }


  // Fonction pour générer les initiales
  getInitiales(nom: string, prenom: string): string {
    const n = nom ? nom.charAt(0).toUpperCase() : '';
    const p = prenom ? prenom.charAt(0).toUpperCase() : '';
    return n + p;
  }

  private setThemeColors(): void {
    if (this.theme === 'sombre') {
      this.text = '#FFF';
      this.background = '#001219';
      this.rouge = '#b80000';

      this.bgblue='#1E40AF'; this.textblue='#93C5FD';
      this.bggreen='#065F46'; this.textgreen='#6EE7B7';
      this.bgyellow='#78350F'; this.textyellow='#FCD34D';
      this.bgpurple='#5B21B6'; this.textpurple='#C4B5FD';
      this.bgpink='#881337'; this.textpink='#F9A8D4';

      this.Logo = 'assets/IconBlanc.svg';
    } else {
      this.text = '#000';
      this.background = '#FFF';
      this.rouge = '#9b0202';

      this.bgblue='#DBEAFE'; this.textblue='#1D4ED8';
      this.bggreen='#D1FAE5'; this.textgreen='#047857';
      this.bgyellow='#FEF3C7'; this.textyellow='#B45309';
      this.bgpurple='#F3E8FF'; this.textpurple='#7C3AED';
      this.bgpink='#FFE4E6'; this.textpink='#BE123C';

      this.Logo = 'assets/IconBlack.svg';
    }
  }

}
