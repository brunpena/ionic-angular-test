import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap, finalize, switchMap, of, catchError } from 'rxjs';
import { PushService } from './push.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    http: HttpClient,
    private pushService: PushService
  ) {
    super(http);
  }
  // =====================
  // LOGIN
  // =====================
  login(data: { email: string; password: string }) {
    return this.post<AuthUser>('/auth/login', data).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  // =====================
  // REGISTER
  // =====================
  register(data: RegisterDto) {
    return this.post<AuthUser>('/auth/register', data).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  // =====================
  // LOGOUT ROBUSTO
  // =====================
  logout() {
    return this.post('/auth/logout').pipe(
      finalize(() => this.clearToken())
    );
  }

  // =====================
  // USER ATUAL
  // =====================
  me() {
    return this.get<AuthUser>('/auth/me');
  }

  // =====================
  // TOKEN HELPERS
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
