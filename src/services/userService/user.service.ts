import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUser(): Observable<User> {
    return this.http.get<User>('/api/user/me'); // récupère depuis MongoDB
  }

  updateUser(data: UserUpdate): Observable<any> {
    return this.http.put('/api/user/update', data); // met à jour MongoDB
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put('/api/user/change-password', { oldPassword, newPassword });
  }
}
