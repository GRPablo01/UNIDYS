import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile.html',
  styleUrls: ['./mobile.css'],
})
export class Mobile implements OnInit {

  isMobile: boolean = false;

  ngOnInit() {
    this.checkScreen();
  }

  // 👀 détecte resize écran
  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  // 📱 logique mobile
  checkScreen() {
    this.isMobile = window.innerWidth < 600;
  }

}