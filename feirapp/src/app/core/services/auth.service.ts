import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

interface AuthUser {
  id: number;
  email: string;
  nome: string;
  token: string;
}

interface RegisterDto { 
  email: string;
  nome: string;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {

  login(data: { email: string; senha: string }) {
    return this.post<AuthUser>('/auth/login', data);
  }

  register(data: RegisterDto) {
    return this.post<AuthUser>('/auth/register', data);
  }

  logout() {
    return this.post('/auth/logout');
  }
}
