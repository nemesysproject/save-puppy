# Interceptors Directory

Este directorio contiene los **HTTP interceptors** para modificar requests/responses HTTP.

## Propósito

Los interceptors permiten interceptar y transformar peticiones HTTP y respuestas de manera global.

## Casos de Uso Comunes

- Agregar headers de autenticación (tokens JWT)
- Logging de peticiones HTTP
- Manejo global de errores
- Transformación de datos
- Caching
- Loading indicators

## Convenciones

- Nombres descriptivos terminados en `.interceptor.ts`
- Usar functional interceptors (Angular 15+)
- Documentar el propósito del interceptor

## Ejemplo de Functional Interceptor

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

## Registro en app.config.ts

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

## Generar un Interceptor

```bash
ng generate interceptor interceptors/auth
```
