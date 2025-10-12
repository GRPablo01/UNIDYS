import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { EnteteE } from '../../../../component-page/Eleve/page-cour/entete-e/entete-e';
import { CPCOURSE } from "../../../../component-page/Eleve/page-cour/cpcourse/cpcourse";
import { ContactE } from "../../../../component/contact-e/contact-e";
import { FooterE } from "../../../../component/footer-e/footer-e";
import { ApprentissageE } from "../../../../component-page/Eleve/page-cour/apprentissage-e/apprentissage-e";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-classe-cp',
  standalone: true, // ⚠️ Indispensable pour utiliser imports
  imports: [HeaderE, EnteteE, CPCOURSE, ContactE, FooterE, ApprentissageE,HttpClientModule],
  templateUrl: './classe-cp.html',
  styleUrls: ['./classe-cp.css'], // corrigé : styleUrls au lieu de styleUrl
})
export class ClasseCPE {}
