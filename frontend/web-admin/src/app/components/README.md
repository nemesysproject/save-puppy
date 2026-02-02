# Components Directory

Este directorio contiene los **componentes reutilizables** de la aplicación web-admin.

## Propósito

Los componentes son piezas de UI reutilizables que se utilizan en múltiples partes de la aplicación.

## Diferencia con Pages

- **Components**: Piezas reutilizables de UI (botones, modales, cards, etc.)
- **Pages**: Vistas completas asociadas a rutas específicas

## Componentes Actuales

- **login** - Componente de inicio de sesión
- **logout** - Componente de cierre de sesión
- **register** - Componente de registro de usuarios

## Convenciones

- Usar standalone components (Angular 14+)
- Nombres descriptivos en kebab-case
- Cada componente en su propio directorio
- Incluir archivos: `.ts`, `.html`, `.css`

## Estructura de un Componente

```
component-name/
├── component-name.ts      # Lógica del componente
├── component-name.html    # Template
├── component-name.css     # Estilos
└── component-name.spec.ts # Tests (opcional)
```

## Generar un Componente

```bash
ng generate component components/nombre-componente
```

## Ejemplo de Componente Standalone

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  // Component logic
}
```
