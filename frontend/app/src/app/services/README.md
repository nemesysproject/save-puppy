# Services Directory

Este directorio contiene los **servicios de negocio** de la aplicación Ionic.

## Propósito

Los servicios encapsulan la lógica de negocio, comunicación con APIs, gestión de estado, y acceso a características nativas de dispositivos móviles.

## Tipos de Servicios Comunes en Ionic

- **API Services**: Comunicación con el backend
- **Auth Service**: Autenticación y autorización
- **Storage Service**: Almacenamiento local (Ionic Storage)
- **Camera Service**: Acceso a la cámara del dispositivo
- **Geolocation Service**: Ubicación del dispositivo
- **Push Notifications**: Notificaciones push
- **State Management**: Gestión de estado compartido

## Convenciones

- Usar `@Injectable({ providedIn: 'root' })` para singleton services
- Nombres descriptivos terminados en `.service.ts`
- Documentar métodos públicos
- Manejar errores apropiadamente

## Ejemplo de Servicio HTTP

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}
  
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }
}
```

## Servicios Nativos con Capacitor

Para acceder a características nativas del dispositivo:

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri
    });
    return image.webPath;
  }
}
```

## Generar un Servicio

```bash
ionic generate service services/nombre-servicio
```
