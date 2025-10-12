import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { EnteteE } from '../../../../component-page/Eleve/page-cour/entete-e/entete-e';
import { CPCOURSP } from '../../../../component-page/Prof/page-cour/cpcoursp/cpcoursp';
import { ContactE } from "../../../../component/contact-e/contact-e";
import { FooterP } from '../../../../component/footer-p/footer-p';
import { ApprentissageP } from '../../../../component-page/Prof/page-cour/apprentissage-p/apprentissage-p';
import { EnteteP } from '../../../../component-page/Prof/page-cour/entete-p/entete-p';
import { HeaderP } from '../../../../component/header-p/header-p';
import { AccompagnementE } from "../../../../component-page/Eleve/page-accueil/accompagnement-e/accompagnement-e";
import { ApprentissageE } from "../../../../component-page/Eleve/page-cour/apprentissage-e/apprentissage-e";


@Component({
  selector: 'app-classe-cp',
  imports: [HeaderP, EnteteP,CPCOURSP, ContactE, FooterP, ApprentissageP, AccompagnementE, ApprentissageE],
  templateUrl: './classe-cp.html',
  styleUrl: './classe-cp.css'
})
export class ClasseCPP {

}
