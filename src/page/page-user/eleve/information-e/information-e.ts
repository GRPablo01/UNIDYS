import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { ContactE } from "../../../../component/contact-e/contact-e";
import { FooterE } from "../../../../component/footer-e/footer-e";
import { PolitiqueE } from '../../../../component-page/Eleve/page-info/politique-e/politique-e';
import { SuprimerE } from '../../../../component-page/Eleve/page-info/suprimer-e/suprimer-e';
import { DPE } from '../../../../component-page/Eleve/page-info/dpe/dpe';

@Component({
  selector: 'app-information-e',
  imports: [HeaderE, PolitiqueE, DPE, SuprimerE, ContactE, FooterE],
  templateUrl: './information-e.html',
  styleUrl: './information-e.css'
})
export class InformationE {

}
