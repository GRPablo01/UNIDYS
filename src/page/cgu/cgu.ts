import { Component } from '@angular/core';
import { CGUTexte } from "../../component/cgu-texte/cgu-texte";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cgu',
  imports: [CGUTexte,RouterLink],
  templateUrl: './cgu.html',
  styleUrl: './cgu.css'
})
export class CGU {

}
