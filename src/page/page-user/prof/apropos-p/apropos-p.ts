import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { RouterLink } from '@angular/router';

import { FooterP } from "../../../../component/footer-p/footer-p";
import { Section5P } from '../../../../component-page/Prof/page-monespace/section5-p/section5-p';
import { Entete3P } from '../../../../component-page/Prof/page-apropos/entete3-p/entete3-p';
import { Entete4P } from '../../../../component-page/Prof/page-apropos/entete4-p/entete4-p';
import { EngagementE } from "../../../../component-page/Eleve/page-apropos/engagement-e/engagement-e";

@Component({
  selector: 'app-apropos-p',
  imports: [HeaderP, Entete3P, Section5P, FooterP, Entete4P, EngagementE],
  templateUrl: './apropos-p.html',
  styleUrl: './apropos-p.css'
})
export class AproposP {



  
}
