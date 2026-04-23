import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../../Backend/services/theme.service';

@Component({
  selector: 'app-histoire',
  imports: [CommonModule,FormsModule],
  templateUrl: './histoire.html',
  styleUrl: './histoire.css',
})
export class Histoire {

  constructor(
    public themeService: ThemeService,
  ) {}
}
