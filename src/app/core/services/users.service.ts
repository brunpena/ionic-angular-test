import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {

  // 🔥 URL ABSOLUTA (ignora /api)
  private readonly baseUrl = 'https://ionic-angular-test-back-production.up.railway.app/users';

  // 🔹 cache reativo
  private user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Buscar usuário logado (com cache)
   */
  me(forceRefresh = false): Observable<User> {
    if (!this.user$.value || forceRefresh) {
      this.http
        .get<User>(`${this.baseUrl}/me`)
        .subscribe(user => this.user$.next(user));
    }

    return this.user$.asObservable() as Observable<User>;
  }

  /**
   * Atualizar perfil e sincronizar cache
   */
  updateMe(data: Partial<User>): Observable<User> {
    return this.http
      .patch<User>(`${this.baseUrl}/me`, data)
      .pipe(tap(updated => this.user$.next(updated)));
  }

  /**
   * Limpar cache (logout)
   */
  clearCache() {
    this.user$.next(null);
  }
}
