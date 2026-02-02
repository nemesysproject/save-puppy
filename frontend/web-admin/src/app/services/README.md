# Services Directory

Este directorio contiene los **servicios de negocio** de la aplicación web-admin.

## Propósito

Los servicios encapsulan la lógica de negocio, comunicación con APIs, y gestión de estado de la aplicación.

## Tipos de Servicios Comunes

- **API Services**: Comunicación con el backend
- **Auth Service**: Autenticación y autorización
- **State Management**: Gestión de estado compartido
- **Utility Services**: Funciones auxiliares

## Convenciones

- Usar `@Injectable({ providedIn: 'root' })` para singleton services
- Nombres descriptivos terminados en `.service.ts`
- Documentar métodos públicos

## Ejemplo

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  
  login(credentials: LoginCredentials) {
    return this.http.post('/api/auth/login', credentials);
  }
}
```

## Generar un Servicio

```bash
ng generate service services/nombre-servicio
```
