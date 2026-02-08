// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {
//   Observable,
//   BehaviorSubject,
//   tap,
//   catchError,
//   throwError,
//   of
// } from 'rxjs';

// import { StorageService } from './storage.service';
// import { User } from '../../shared/models/user.model';

// export interface AuthResponse {
//   token: string;
//   user: User;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface RegisterRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthHttpService {

//   private readonly apiUrl = '/api/auth';

//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   readonly currentUser$ = this.currentUserSubject.asObservable();

//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

//   constructor(
//     private http: HttpClient,
//     private storage: StorageService
//   ) {
//     this.initAuth();
//   }

//   // =============================
//   // INIT
//   // =============================
//   private initAuth(): void {
//     const token = this.storage.getItem('auth_token');

//     if (token) {
//       this.isAuthenticatedSubject.next(true);
//     }
//   }

//   // =============================
//   // LOGIN
//   // =============================
//   login(request: LoginRequest): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(`${this.apiUrl}/login`, request)
//       .pipe(
//         tap(res => this.setSession(res)),
//         catchError(err => {
//           console.error('Login failed', err);
//           return throwError(() => err);
//         })
//       );
//   }

//   // =============================
//   // REGISTER
//   // =============================
//   register(request: RegisterRequest): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(`${this.apiUrl}/register`, request)
//       .pipe(
//         tap(res => this.setSession(res)),
//         catchError(err => {
//           console.error('Register failed', err);
//           return throwError(() => err);
//         })
//       );
//   }

//   // =============================
//   // LOGOUT API
//   // =============================
//   logout(): Observable<void> {
//     return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
//       tap(() => this.logoutLocal()),
//       catchError(err => {
//         this.logoutLocal();
//         return of(undefined);
//       })
//     );
//   }

//   // =============================
//   // LOGOUT LOCAL (INTERCEPTOR SAFE)
//   // =============================
//   logoutLocal(): void {
//     this.storage.removeItem('auth_token');
//     this.currentUserSubject.next(null);
//     this.isAuthenticatedSubject.next(false);
//   }

//   // =============================
//   // HELPERS
//   // =============================
//   private setSession(res: AuthResponse) {
//     this.storage.setItem('auth_token', res.token);
//     this.currentUserSubject.next(res.user);
//     this.isAuthenticatedSubject.next(true);
//   }

//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   isAuthenticated(): boolean {
//     return this.isAuthenticatedSubject.value;
//   }

//   getToken(): string | null {
//     return this.storage.getItem('auth_token');
//   }
// }

import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  of,
  delay,
  tap
} from 'rxjs';

import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthHttpService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {
    this.init();
  }

  // =============================
  // INIT
  // =============================
  private init() {
    const token = this.storage.getItem('auth_token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  // =============================
  // MOCK LOGIN
  // =============================
  login(request: LoginRequest): Observable<AuthResponse> {

    const fake: AuthResponse = {
      token: 'dev-token',
      user: {
        id: '1',
        name: 'Dev User',
        email: request.email
      }
    };

    return of(fake).pipe(
      delay(300),
      tap(res => this.setSession(res))
    );
  }

  // =============================
  // MOCK REGISTER
  // =============================
  register(request: RegisterRequest): Observable<AuthResponse> {

    const fake: AuthResponse = {
      token: 'dev-token',
      user: {
        id: '1',
        name: request.name,
        email: request.email
      }
    };

    return of(fake).pipe(
      delay(300),
      tap(res => this.setSession(res))
    );
  }

  // =============================
  // MOCK LOGOUT
  // =============================
  logout(): Observable<void> {
    this.logoutLocal();
    return of(undefined);
  }

  logoutLocal(): void {
    this.storage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    // Ensure the shared AuthService session is cleared as well
    try {
      this.authService.logout();
    } catch (e) {
      // noop
    }
  }

  // =============================
  // HELPERS
  // =============================
  private setSession(res: AuthResponse) {
    this.storage.setItem('auth_token', res.token);
    this.currentUserSubject.next(res.user);
    this.isAuthenticatedSubject.next(true);

    // Mirror session into the main AuthService so guards/components
    // that rely on AuthService.user$ see the authenticated user.
    try {
      this.authService.setSessionFromResponse(res.token, res.user as any);
    } catch (e) {
      // noop
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return this.storage.getItem('auth_token');
  }
}
