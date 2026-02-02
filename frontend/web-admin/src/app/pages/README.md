# Pages Directory

Este directorio contiene las **páginas/vistas** principales de la aplicación web-admin.

## Propósito

Las páginas son componentes de nivel superior que representan vistas completas de la aplicación, generalmente asociadas con rutas específicas.

## Estructura Sugerida

```
pages/
├── dashboard/       # Panel principal de administración
├── users/          # Gestión de usuarios
├── settings/       # Configuración del sistema
├── reports/        # Reportes y estadísticas
└── ...             # Otras páginas según necesidad
```

## Convenciones

- Cada página debe tener su propio directorio
- Usar lazy loading para optimizar el rendimiento
- Las páginas son standalone components en Angular 21

## Ejemplo de Uso en Rutas

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  }
];
```
