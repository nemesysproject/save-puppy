# Interceptors Directory

Este directorio contiene los **HTTP interceptors** para modificar requests/responses HTTP en la aplicación móvil.

## Propósito

Los interceptors permiten interceptar y transformar peticiones HTTP y respuestas de manera global, muy útil para aplicaciones móviles que consumen APIs.

## Casos de Uso en Apps Móviles

- Agregar headers de autenticación (tokens JWT)
- Agregar headers de dispositivo/versión de app
- Logging de peticiones HTTP para debugging
- Manejo global de errores (401, 500, etc.)
- Mostrar/ocultar loading indicators
- Agregar timeout a peticiones
- Retry automático en caso de error de red
- Modificar URLs base según ambiente (dev/prod)

## Convenciones

- Nombres descriptivos terminados en `.interceptor.ts`
- Usar functional interceptors (Angular 15+)
- Documentar el propósito del interceptor

## Ejemplo de Auth Interceptor

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
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('X-App-Version', '1.0.0')
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

## Ejemplo de Loading Interceptor

```typescript
// loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingController = inject(LoadingController);
  let loading: HTMLIonLoadingElement;

  loadingController.create({
    message: 'Cargando...'
  }).then(l => {
    loading = l;
    loading.present();
  });

  return next(req).pipe(
    finalize(() => {
      if (loading) {
        loading.dismiss();
      }
    })
  );
};
```

## Ejemplo de Error Handler Interceptor

```typescript
// error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastController = inject(ToastController);

  return next(req).pipe(
    catchError(async (error) => {
      const toast = await toastController.create({
        message: error.message || 'Ha ocurrido un error',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return throwError(() => error);
    })
  );
};
```

## Registro en main.ts

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { errorInterceptor } from './app/interceptors/error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
});
```

## Generar un Interceptor

```bash
ionic generate interceptor interceptors/auth
```
