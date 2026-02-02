# Guards Directory

Este directorio contiene los **route guards** para proteger rutas de la aplicación.

## Propósito

Los guards controlan el acceso a rutas específicas basándose en condiciones como autenticación, permisos, o estado de la aplicación.

## Tipos de Guards

- **CanActivate**: Controla si una ruta puede ser activada
- **CanActivateChild**: Controla rutas hijas
- **CanDeactivate**: Controla si se puede salir de una ruta
- **CanMatch**: Controla si una ruta coincide

## Convenciones

- Nombres descriptivos terminados en `.guard.ts`
- Usar functional guards (Angular 15+)
- Documentar la lógica de autorización

## Ejemplo de Functional Guard

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

## Uso en Rutas

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  }
];
```

## Generar un Guard

```bash
ng generate guard guards/auth
```
