# Pages Directory

Este directorio contiene las **páginas/pantallas** principales de la aplicación Ionic.

## Propósito

Las páginas son componentes de nivel superior que representan pantallas completas de la aplicación móvil, generalmente asociadas con rutas específicas.

## Estructura Sugerida

```
pages/
├── home/           # Página principal
├── profile/        # Perfil de usuario
├── settings/       # Configuración
├── details/        # Páginas de detalle
└── ...             # Otras páginas según necesidad
```

## Convenciones Ionic

- Cada página debe tener su propio directorio
- Usar lazy loading para optimizar el rendimiento
- Las páginas son standalone components en Angular 14+
- Incluir `ion-header`, `ion-content`, `ion-footer` según necesidad

## Generar una Página con Ionic CLI

```bash
ionic generate page pages/nombre-pagina
```

Esto creará automáticamente:
- Component TypeScript
- Template HTML
- Estilos SCSS
- Archivo de rutas (si es necesario)
- Tests spec

## Ejemplo de Página Ionic

```typescript
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  // Page logic
}
```

## Template Típico de Página

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Título de la Página</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <!-- Contenido de la página -->
</ion-content>
```

## Routing

Las páginas se configuran en `app.routes.ts` para navegación.
