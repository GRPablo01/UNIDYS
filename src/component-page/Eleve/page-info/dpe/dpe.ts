import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService, UserUpdate } from '../../../../services/userService/user.service';

@Component({
  selector: 'app-dpe',
  standalone: true,
  templateUrl: './dpe.html',
  styleUrls: ['./dpe.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [UserService] // <-- important pour l’injection du service
})
export class DPE implements OnInit {
  showModal1 = false;
  showModal2 = false;

  firstName = '';
  lastName = '';
  email = '';
  oldPassword = '';
  newPassword = '';

  private userService = inject(UserService); // injection pour composants standalone

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
    });
  }

  updateProfile() {
    const data: UserUpdate = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
    this.userService.updateUser(data).subscribe({
      next: () => {
        alert('Profil mis à jour !');
        this.showModal1 = false;
      },
      error: (err) => {
        console.error(err);
        alert(err.error.message || 'Erreur lors de la mise à jour du profil.');
      }
    });
  }
  
  updatePassword() {
    if (!this.oldPassword || !this.newPassword) {
      alert('Veuillez remplir les champs du mot de passe.');
      return;
    }
    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        alert('Mot de passe mis à jour !');
        this.oldPassword = '';
        this.newPassword = '';
        this.showModal1 = false;
      },
      error: (err) => {
        console.error(err);
        alert(err.error.message || 'Erreur lors du changement de mot de passe.');
      }
    });
  }
}  