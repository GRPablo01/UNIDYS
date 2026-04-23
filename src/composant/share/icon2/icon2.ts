import { Component } from '@angular/core';
import { Theme } from "../theme/theme";
import { MMS } from '../mms/mms';
import { Notif } from "../notif/notif";



@Component({
  selector: 'app-icon2',
  imports: [Theme, MMS, Notif],
  templateUrl: './icon2.html',
  styleUrl: './icon2.css',
})
export class Icon2 {

}
