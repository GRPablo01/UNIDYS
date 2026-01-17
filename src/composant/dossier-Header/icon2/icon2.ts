import { Component } from '@angular/core';
import { Parametre } from "../parametre/parametre";
import { Support } from "../support/support";
import { Notif } from '../notif/notif';

@Component({
  selector: 'app-icon2',
  imports: [Parametre, Support,Notif],
  templateUrl: './icon2.html',
  styleUrl: './icon2.css',
})
export class Icon2 {

}
