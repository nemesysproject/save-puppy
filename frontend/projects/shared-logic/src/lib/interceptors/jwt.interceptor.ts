import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor funcional JWT.
 * - Añade automáticamente el token JWT a todas las peticiones HTTP.
 * - Maneja errores de autenticación (401) y de acceso prohibido (403).
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getBearerToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearToken();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        console.error('Acceso prohibido. Redirigiendo a la página principal.');
        router.navigate(['/']);
      }
      return throwError(() => error);
    }),
  );
};
