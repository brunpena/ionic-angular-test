import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { StorageService } from './storage.service';
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

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private apiUrl = '/api/auth'; // Replace with actual API URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.initAuth();
  }

  /**
   * Initialize authentication state from stored token
   */
  private initAuth(): void {
    const token = this.storage.getItem('auth_token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Login user with email and password
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.storage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  /**
   * Register new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        this.storage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.storage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }),
      catchError(error => {
        // Clear local state even if logout fails
        this.storage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        console.error('Logout failed:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return this.storage.getItem('auth_token');
  }
}
