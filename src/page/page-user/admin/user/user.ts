import { Component } from '@angular/core';
import { HeaderA } from "../../../../component/header-a/header-a";
import { ListeUserA } from "../../../../component-page/Admin/liste-user-a/liste-user-a";

@Component({
  selector: 'app-user',
  imports: [HeaderA, ListeUserA],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {

}
