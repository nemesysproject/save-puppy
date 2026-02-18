import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * JWT Interceptor
 * Automatically adds JWT token to all HTTP requests
 * Handles authentication errors and token expiration
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // Get bearer token
    const token = this.authService.getBearerToken();

    // Add token to Authorization header if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.status === 401) {
          this.authService.clearToken();
          this.router.navigate(['/login']);
        }

        // Handle 403 Forbidden
        if (error.status === 403) {
          console.error('Access forbidden');
          this.router.navigate(['/']);
        }

        return throwError(() => error);
      })
    );
  }
}
