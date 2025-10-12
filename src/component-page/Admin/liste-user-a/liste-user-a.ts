import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  xp?: number;
  level?: number;
}

// ================= PIPE FILTER ROLE =================
@Pipe({ name: 'filterRole', standalone: true })
export class FilterRolePipe implements PipeTransform {
  transform(users: User[], role: string): User[] {
    if (!role) return users;
    return users.filter(u => u.role === role);
  }
}

@Component({
  selector: 'app-liste-user-a',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, FormsModule, FilterRolePipe],
  templateUrl: './liste-user-a.html',
  styleUrls: ['./liste-user-a.css']
})
export class ListeUserA implements OnInit {
  users: User[] = [];
  groupedUsers: { [key: string]: User[] } = {};
  groupedUsersKeys: string[] = [];
  roleFilter: string = '';

  // Filtre pour le modal
  groupRoleFilter: string = '';

  // Modals
  showEditModal = false;
  selectedUser: User = { _id: '', nom: '', prenom: '', email: '', role: 'eleve' };
  showGroupModal = false;
  currentGroup = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ================= LOAD USERS =================
  loadUsers(): void {
    this.http.get<User[]>('http://localhost:3000/api/unidys/users')
      .subscribe({
        next: users => {
          if (Array.isArray(users)) {
            this.users = users.filter(u => u.role === 'eleve' || u.role === 'prof');
            this.users.sort((a, b) => a.nom.localeCompare(b.nom));
            this.groupUsers();
          } else {
            this.users = [];
          }
        },
        error: err => console.error('Erreur API utilisateurs:', err)
      });
  }

  // ================= GROUPE PAR PREMIERE LETTRE =================
  groupUsers(): void {
    const filtered = this.roleFilter ? this.users.filter(u => u.role === this.roleFilter) : this.users;
    this.groupedUsers = {};
    filtered.forEach(u => {
      const letter = u.prenom.charAt(0).toUpperCase();
      if (!this.groupedUsers[letter]) this.groupedUsers[letter] = [];
      this.groupedUsers[letter].push(u);
    });
    this.groupedUsersKeys = Object.keys(this.groupedUsers).sort();
  }

  applyFilter(): void {
    this.groupUsers();
  }

  applyGroupFilter(): void {
    // Pas besoin de manipuler groupedUsers ici, le pipe filterRole gère déjà
  }

  // ================= MODAL GROUPE =================
  openGroupModal(group: string): void {
    this.currentGroup = group;
    this.groupRoleFilter = ''; // reset filtre à l'ouverture
    this.showGroupModal = true;
  }

  closeGroupModal(): void {
    this.showGroupModal = false;
  }

  // ================= MODAL EDIT =================
  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeModal(): void {
    this.showEditModal = false;
  }

  updateUser(): void {
    if (!this.selectedUser._id) return;
  
    this.http.put(`http://localhost:3000/api/unidys/users/${this.selectedUser._id}`, this.selectedUser)
      .subscribe({
        next: (updatedUser: any) => {
          // 1. Mettre à jour la liste locale
          this.users = this.users.map(u => u._id === updatedUser._id ? updatedUser : u);
          this.groupUsers();
  
          // 2. Construire le nouveau nom complet du prof
          const nouveauNomProf = `${updatedUser.prenom} ${updatedUser.nom}`;
  
          // 3. Appeler une API pour mettre à jour tous ses cours
          this.http.put(`http://localhost:3000/api/unidys/cours/updateByProf/${updatedUser._id}`, {
            nomProf: nouveauNomProf
          }).subscribe({
            next: () => console.log(`✅ Cours mis à jour pour ${nouveauNomProf}`),
            error: err => console.error('Erreur lors de la mise à jour des cours:', err)
          });
  
          // 4. Fermer la modal
          this.closeModal();
        },
        error: err => console.error('Erreur lors de la modification:', err)
      });
  }
  

  deleteUser(userId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    this.http.delete(`http://localhost:3000/api/unidys/users/${userId}`)
      .subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== userId);
          this.groupUsers();
        },
        error: err => console.error('Erreur lors de la suppression:', err)
      });
  }
}
