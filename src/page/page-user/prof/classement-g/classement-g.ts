import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { Tableau } from "../../../../component-page/Eleve/page-classement/tableau/tableau";
import { FooterP } from "../../../../component/footer-p/footer-p";

@Component({
  selector: 'app-classement-g',
  imports: [HeaderP, Tableau, FooterP],
  templateUrl: './classement-g.html',
  styleUrl: './classement-g.css'
})
export class ClassementG {

}
