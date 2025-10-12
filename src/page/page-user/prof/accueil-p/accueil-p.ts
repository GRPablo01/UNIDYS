import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";



import { Section4E } from "../../../../component-page/Eleve/page-accueil/section4-e/section4-e";
import { FooterP } from '../../../../component/footer-p/footer-p';
import { ContactE } from '../../../../component/contact-e/contact-e';
import { EnteteP } from '../../../../component-page/Prof/page-accueil/entete-p/entete-p';
import { AccompagnementP } from '../../../../component-page/Prof/page-accueil/accompagnement-p/accompagnement-p';
import { RessourcesP } from '../../../../component-page/Prof/page-accueil/ressources-p/ressources-p';
import { AccompagnementE } from "../../../../component-page/Eleve/page-accueil/accompagnement-e/accompagnement-e";
import { RessourcesE } from "../../../../component-page/Eleve/page-accueil/ressources-e/ressources-e";
import { Section4P } from "../../../../component-page/Prof/page-accueil/section4-p/section4-e";

@Component({
  selector: 'app-accueil-p',
  imports: [HeaderP, EnteteP, AccompagnementP, RessourcesP, Section4E, FooterP, ContactE, AccompagnementE, RessourcesE, Section4P],
  templateUrl: './accueil-p.html',
  styleUrl: './accueil-p.css'
})
export class AccueilP {

}
