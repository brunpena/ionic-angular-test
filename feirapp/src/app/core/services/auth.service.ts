import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  cidade: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly STORAGE_KEY = 'feirapp_user';

  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  // Observable público usado por guards e componentes
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  // =============================
  // SESSION RESTORE (refresh page)
  // =============================
  private restoreSession() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;

    try {
      const user = JSON.parse(raw);
      this.userSubject.next(user);
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // =============================
  // AUTH STATE
  // =============================
  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getToken(): string | null {
    return this.userSubject.value?.token ?? null;
  }

  getCurrentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  // =============================
  // LOGIN (REAL BACKEND READY)
  // =============================
  login(email: string, senha: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(
      '/api/auth/login',
      { email, senha }
    ).pipe(
      tap(user => this.setSession(user))
    );
  }

  // =============================
  // REGISTER
  // =============================
  register(data: {
    nome: string;
    email: string;
    senha: string;
    cidade: string;
  }): Observable<AuthUser> {

    return this.http.post<AuthUser>(
      '/api/auth/register',
      data
    ).pipe(
      tap(user => this.setSession(user))
    );
  }

  // =============================
  // LOGOUT
  // =============================
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userSubject.next(null);
  }

  // =============================
  // INTERNAL
  // =============================
  private setSession(user: AuthUser) {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(user)
    );

    this.userSubject.next(user);
  }

  // Accept an auth response from a mock or alternate service
  // and map it to the internal AuthUser shape.
  setSessionFromResponse(token: string, payload: { id: string; name?: string; email?: string; cidade?: string }) {
    const user: AuthUser = {
      id: payload.id,
      nome: (payload as any).name ?? (payload as any).nome ?? '',
      email: payload.email ?? '',
      cidade: payload.cidade ?? '',
      token
    };

    this.setSession(user);
  }
}
