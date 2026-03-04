import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../models/auth.model';
import { API_BASE_URL } from './api.tokens';

/**
 * Token para inyectar la URL de autenticación.
 * Permite configurar la URL desde el módulo principal de la aplicación (app.config.ts o app.module.ts).
 */
export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL', {
  providedIn: 'root',
  factory: () => {
    const base = inject(API_BASE_URL);
    return `${base}/auth`;
  }
});

/**
 * Authentication Service
 * Manages JWT token storage and user authentication state
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'current_user';
  private authSubject = new BehaviorSubject<User | null>(this.loadUser());
  public auth$: Observable<User | null> = this.authSubject.asObservable();

  private http = inject(HttpClient);
  // Se inyecta la URL usando el token, permitiendo sobreescritura por configuración
  private readonly apiUrl = inject(AUTH_API_URL);

  constructor() { }

  /**
   * Log in a user
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  /**
   * Get the stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get the token with Bearer prefix for Authorization header
   */
  getBearerToken(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Set the JWT token and optionally the user data
   */
  setToken(token: string, user?: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.authSubject.next(user);
    }
  }

  /**
   * Clear the JWT token and user data
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authSubject.next(null);
  }

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): User | null {
    return this.authSubject.getValue();
  }

  /**
   * Load user from localStorage
   */
  private loadUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Update current user
   */
  updateUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.authSubject.next(user);
  }

  /**
   * Decode JWT token (simple implementation - doesn't verify signature)
   */
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }
}
