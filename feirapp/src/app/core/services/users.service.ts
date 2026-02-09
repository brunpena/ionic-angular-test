import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

interface User {
  id: number;
  email: string;
  nome: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService extends ApiService {

  me() {
    return this.get<User>('/users/me');
  }

  updateMe(data: Partial<User>) {
    return this.patch<User>('/users/me', data);
  }
}
