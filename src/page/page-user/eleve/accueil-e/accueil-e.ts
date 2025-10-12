import { Component } from '@angular/core';
import { HeaderE } from '../../../../component/header-e/header-e';
import { EnteteE } from '../../../../component-page/Eleve/page-accueil/entete-e/entete-e';
import { AccompagnementE } from "../../../../component-page/Eleve/page-accueil/accompagnement-e/accompagnement-e";
import { RessourcesE } from '../../../../component-page/Eleve/page-accueil/ressources-e/ressources-e';
import { Section4E } from "../../../../component-page/Eleve/page-accueil/section4-e/section4-e";
import { ContactE } from '../../../../component/contact-e/contact-e';
import { FooterE } from '../../../../component/footer-e/footer-e';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil-e',
  imports: [HeaderE, EnteteE, AccompagnementE, RessourcesE, Section4E,FooterE,ContactE,RouterLink],
  templateUrl: './accueil-e.html',
  styleUrl: './accueil-e.css'
})
export class AccueilE {

}
