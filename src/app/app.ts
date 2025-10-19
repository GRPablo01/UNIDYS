import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Connexion, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'UniDys';
}
