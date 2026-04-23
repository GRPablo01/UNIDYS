import { Component } from '@angular/core';
import { MMS } from '../mms/mms';
import { Notif } from '../notif/notif';
import { Theme } from '../theme/theme';

@Component({
  selector: 'app-icon3',
  imports: [MMS,Theme,Notif],
  templateUrl: './icon3.html',
  styleUrl: './icon3.css',
})
export class Icon3 {

}
