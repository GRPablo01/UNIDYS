import { Component } from '@angular/core';
import { HeaderA } from "../../../../component/header-a/header-a";
import { ListeCoursA } from "../../../../component-page/Admin/liste-cours-a/liste-cours-a";

@Component({
  selector: 'app-cours',
  imports: [HeaderA, ListeCoursA],
  templateUrl: './cours.html',
  styleUrl: './cours.css'
})
export class Cours {

}
