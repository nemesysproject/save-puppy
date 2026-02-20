# Bootstrap Configuration - Web App

Documentación de la integración de Bootstrap en el proyecto web-app.

## 📦 Instalación

Bootstrap se instaló en el proyecto raíz:

```bash
npm install bootstrap --legacy-peer-deps
```

## ⚙️ Configuración

### 1. **angular.json**
Bootstrap CSS se agregó a la configuración de estilos globales:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "projects/web-app/src/styles.scss"
]
```

### 2. **styles.scss**
Se importó Bootstrap SCSS con variables personalizadas:

```scss
// Variables personalizadas
$primary: #667eea;
$secondary: #764ba2;
$success: #28a745;
$danger: #e74c3c;
$warning: #ffc107;
$info: #17a2b8;
$light: #f5f7fa;
$dark: #2c3e50;

// Importar Bootstrap SCSS
@import 'node_modules/bootstrap/scss/bootstrap';
```

## 🎨 Colores Personalizados

- **Primary:** `#667eea` (Purple-Blue)
- **Secondary:** `#764ba2` (Dark Purple)
- **Danger:** `#e74c3c` (Red)
- **Light:** `#f5f7fa` (Light Gray)
- **Dark:** `#2c3e50` (Dark Gray)

## 🛠️ Utilidades Disponibles

Se agregaron utilidades personalizadas en `styles.scss`:

### 1. **Gradiente de Texto**
```html
<h1 class="text-primary-gradient">Save Puppy</h1>
```

### 2. **Botón con Gradiente**
```html
<button class="btn btn-primary-gradient">Click me</button>
```

### 3. **Sombra de Tarjeta**
```html
<div class="card card-shadow">
  <div class="card-body">...</div>
</div>
```

### 4. **Bordes Redondeados**
```html
<div class="rounded-lg">...</div>  <!-- 12px -->
<div class="rounded-xl">...</div>  <!-- 16px -->
```

## 📝 Uso en Componentes

### Ejemplo: Usar Bootstrap en un nuevo componente

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6">
          <div class="card card-shadow">
            <div class="card-body">
              <h5 class="card-title">Titulo</h5>
              <p class="card-text">Contenido</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExampleComponent {}
```

## 📖 Clases Bootstrap Comunes

### Espaciado
- `m-*` - Margin (m, mx, my, mt, mb, ml, mr)
- `p-*` - Padding (p, px, py, pt, pb, pl, pr)

Ejemplo: `mt-5 mb-3 px-4`

### Flexbox
- `d-flex` - Display flex
- `flex-column` - Flex direction column
- `align-items-center` - Align items center
- `justify-content-between` - Justify content

### Grid
- `container` - Container fijo
- `container-fluid` - Container fluido
- `row` - Fila de grid
- `col-*`, `col-md-*`, `col-lg-*` - Columnas responsivas

### Typografía
- `display-1` a `display-6` - Display headings
- `h1` a `h6` - Headings
- `lead` - Lead text
- `text-muted` - Muted text

### Colores
- `text-primary`, `text-secondary`, `text-danger`, etc.
- `bg-primary`, `bg-light`, `bg-dark`, etc.

### Botones
- `btn` - Clase base
- `btn-primary`, `btn-secondary`, `btn-danger`, etc.
- `btn-lg`, `btn-sm` - Tamaños
- `btn-outline-primary` - Outline buttons

## 🔗 Recursos

- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Bootstrap Grid System](https://getbootstrap.com/docs/5.3/layout/grid/)
- [Bootstrap Components](https://getbootstrap.com/docs/5.3/components/)

## ⚠️ Notas Importantes

1. **Login Component**: Utiliza estilos personalizados (no Bootstrap) para mantener su diseño único.
2. **SCSS Customization**: Las variables de Bootstrap se pueden sobrescribir antes de su importación.
3. **Bundle Size**: Bootstrap CSS está minificado (`bootstrap.min.css`) para optimizar el tamaño del bundle.

## 🚀 Próximos Pasos

1. Crear componentes (header, sidebar, footer) utilizando Bootstrap
2. Crear páginas de dashboard con Grid de Bootstrap
3. Implementar formularios con Bootstrap
4. Usar componentes de Bootstrap (cards, modals, navabar, etc.)

---

**Última actualización:** Febrero 20, 2026
