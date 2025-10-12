import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { Entete3E } from "../../../../component-page/Eleve/page-apropos/entete3-e/entete3-e";
import { EngagementE } from "../../../../component-page/Eleve/page-apropos/engagement-e/engagement-e";
import { Entete4E } from "../../../../component-page/Eleve/page-apropos/entete4-e/entete4-e";
import { FooterE } from "../../../../component/footer-e/footer-e";
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-apropos-e',
  standalone: true,
  imports: [
    CommonModule,
    HeaderE,
    Entete3E,
    EngagementE,
    Entete4E,
    FooterE,
],
  templateUrl: './apropos-e.html',
  styleUrls: ['./apropos-e.css'], // <-- corrigé
})
export class AproposE {}
