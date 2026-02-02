# Components Directory

Este directorio contiene los **componentes reutilizables** de la aplicación móvil.

## Propósito

Los componentes son piezas de UI reutilizables que se utilizan en múltiples partes de la aplicación Ionic.

## Diferencia con Pages

- **Components**: Piezas reutilizables de UI (botones, modales, cards, listas, etc.)
- **Pages**: Vistas completas de páginas asociadas a rutas específicas (pantallas de la app)

## Convenciones

- Usar standalone components (Angular 14+)
- Nombres descriptivos en kebab-case
- Cada componente en su propio directorio
- Incluir archivos: `.ts`, `.html`, `.scss`

## Estructura de un Componente

```
component-name/
├── component-name.component.ts      # Lógica del componente
├── component-name.component.html    # Template
├── component-name.component.scss    # Estilos
└── component-name.component.spec.ts # Tests (opcional)
```

## Generar un Componente con Ionic CLI

```bash
ionic generate component components/nombre-componente
```

## Componentes Ionic Comunes

Aprovecha los componentes de Ionic UI:
- `ion-card`, `ion-list`, `ion-item`
- `ion-button`, `ion-input`, `ion-select`
- `ion-modal`, `ion-popover`, `ion-alert`
- `ion-header`, `ion-toolbar`, `ion-content`

## Ejemplo de Componente Standalone

```typescript
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {
  // Component logic
}
```
