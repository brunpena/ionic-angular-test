import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs';

interface AuthUser {
  id: number;
  email: string;
  nome: string;
  token: string;
}

interface RegisterDto { 
  email: string;
  name: string;
  password: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {

  private readonly TOKEN_KEY = 'auth_token';

  login(data: { email: string; password: string }) {
    return this.post<AuthUser>('/auth/login', data).pipe(
      tap(res => this.setToken(res.token))
    );
  }


  register(data: RegisterDto) {
    return this.post<AuthUser>('/auth/register', data).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  logout() {
    this.clearToken();
    return this.post('/auth/logout');
  }

  // =====================
  // 🔑 Helpers de auth
  // =====================

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
