# Components Directory

Este directorio contiene los **componentes reutilizables** de la aplicación web-admin.

## Propósito

Los componentes son piezas de UI reutilizables que se utilizan en múltiples partes de la aplicación.

## Diferencia con Pages

- **Components**: Piezas reutilizables de UI (botones, modales, cards, layout, etc.)
- **Pages**: Vistas completas asociadas a rutas específicas

## Componentes Actuales

### Componentes de Layout
- **header** - Encabezado superior con perfil de usuario y logout
- **sidebar** - Menú lateral de navegación
- **footer** - Pie de página con redes sociales y derechos de autor
- **layout** - Contenedor principal que integra header, sidebar, footer y router-outlet

### Componentes de Autenticación
- **login** - Componente de inicio de sesión
- **logout** - Componente de cierre de sesión
- **register** - Componente de registro de usuarios

## Estructura del Layout

```
layout.component.ts (contenedor principal)
├── header.component.ts
│   ├─ Logo/Título
│   ├─ Avatar y nombre de usuario
│   └─ Botón "Cerrar Sesión"
│
├─ sidebar.component.ts
│   ├─ Navegación Refugios (/shelters)
│   ├─ Navegación Mascotas (/pets)
│   ├─ Navegación Dueños (/owners)
│   ├─ Navegación Configuración (/settings)
│   └─ Navegación Ayuda (/help)
│
├─ router-outlet (contenido de páginas)
│
└── footer.component.ts
    ├─ Información de Save Puppy
    ├─ Redes Sociales (Facebook, Instagram, Twitter, LinkedIn, GitHub)
    ├─ Contacto (email, teléfono)
    └─ Copyright y créditos
```

## Características del Layout

### Header
- Gradiente morado-azul (#667eea → #764ba2)
- Perfil de usuario con avatar
- Botón logout con confirmación
- Responsive (oculta partes en móvil)

### Sidebar
- Menú de navegación con iconos emoji
- Estados activos automáticos (routerLinkActive)
- Scroll interno si hay muchos items
- Responsive: colapsable a iconos en móvil

### Footer
- Grid responsivo (automático 3 columnas → 1)
- Iconos de redes sociales con efectos hover
- Enlaces seguros (target="_blank", rel="noopener")

### Layout Principal
- Flexbox con 3 zonas: header, cuerpo, footer
- Cuerpo con sidebar + contenido principal
- Scrollable solo en contenido principal
- Altura 100vh (pantalla completa)

## Convenciones

- Usar standalone components (Angular 20+)
- Nombres descriptivos en kebab-case con sufijo `.component.ts`
- Cada componente en su propio directorio
- Inline templates y styles cuando sean cortos
- Usar signals para estado reactivo (signal API)

## Estructura de un Componente

```
component-name/
├── component-name.ts      # Lógica del componente (template + styles inline)
└── component-name.spec.ts # Tests (opcional)
```

O para componentes más complejos:

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
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `<button>{{ label() }}</button>`,
  styles: [`button { padding: 0.75rem 1.5rem; }`]
})
export class ButtonComponent {
  label = signal('Click me');
}
```

## Cómo Agregar una Nueva Página al Layout

1. **Crear componente página** en `pages/mi-seccion/mi-seccion.component.ts`
2. **Agregar ruta** en `app.routes.ts`:
```typescript
{ path: 'mi-seccion', component: MiSeccionComponent }
```
3. **Agregar opción en sidebar** (`sidebar.component.ts`):
```typescript
navItems = signal<NavItem[]>([
  { label: 'Mi Sección', path: '/mi-seccion', icon: '🏠' }
]);
```

## Colores y Tema

| Elemento | Color | Uso |
|----------|-------|-----|
| Primario | #667eea → #764ba2 (gradiente) | Headers, buttons, activos |
| Fondo | #f5f7fa | Background de pages |
| Sidebar | #2c3e50 | Background sidebar |
| Texto | #2c3e50 | Texto principal |
| Borde | #e8ecf1 | Separadores, borders |
| Hover | rgba(white, 0.1) | Estados hover |

## Próximas Mejoras

- [ ] AuthGuard para proteger rutas
- [ ] Dark Mode toggle
- [ ] Hamburger menu en móvil
- [ ] Toast/Notification system
- [ ] User dropdown menu
- [ ] Breadcrumbs
- [ ] Search global
- [ ] Analytics
