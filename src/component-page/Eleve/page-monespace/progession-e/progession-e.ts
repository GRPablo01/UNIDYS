import { Component } from '@angular/core';
import { Section5E } from '../section5-e/section5-e';
import { LevelE } from "../level-e/level-e";

import { ClassementE } from "../classement-e/classement-e";

@Component({
  selector: 'app-progession-e',
  imports: [Section5E, LevelE, ClassementE],
  templateUrl: './progession-e.html',
  styleUrl: './progession-e.css'
})
export class ProgessionE {

}
