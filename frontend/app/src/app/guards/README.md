# Guards Directory

Este directorio contiene los **route guards** para proteger rutas de la aplicación móvil.

## Propósito

Los guards controlan el acceso a rutas/páginas específicas basándose en condiciones como autenticación, permisos, conectividad, o estado de la aplicación.

## Tipos de Guards

- **CanActivate**: Controla si una ruta puede ser activada
- **CanActivateChild**: Controla rutas hijas
- **CanDeactivate**: Controla si se puede salir de una ruta (útil para guardar cambios)
- **CanMatch**: Controla si una ruta coincide

## Casos de Uso en Apps Móviles

- Verificar autenticación antes de acceder a páginas protegidas
- Validar permisos de usuario
- Verificar conectividad a internet
- Comprobar si el dispositivo tiene ciertas capacidades
- Validar si se completó el onboarding

## Convenciones

- Nombres descriptivos terminados en `.guard.ts`
- Usar functional guards (Angular 15+)
- Documentar la lógica de autorización

## Ejemplo de Auth Guard

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

## Ejemplo de Connectivity Guard

```typescript
// online.guard.ts
import { inject } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

export const onlineGuard = async () => {
  const status = await Network.getStatus();
  const toastController = inject(ToastController);
  
  if (status.connected) {
    return true;
  }
  
  const toast = await toastController.create({
    message: 'Esta función requiere conexión a internet',
    duration: 2000,
    color: 'warning'
  });
  await toast.present();
  
  return false;
};
```

## Uso en Rutas

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  }
];
```

## Generar un Guard

```bash
ionic generate guard guards/auth
```
