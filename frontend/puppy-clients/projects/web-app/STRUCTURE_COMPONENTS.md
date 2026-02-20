# Estructura de Componentes - Web App

Documentación de la estructura de componentes (header, sidebar, footer, layout) y protección de rutas con autenticación.

## 📁 Estructura de Carpetas

```
src/app/
├── pages/
│   ├── login/           # Componente de login (sin layout)
│   └── dashboard/       # Página de dashboard (dentro del layout)
├── components/
│   ├── header/          # Encabezado con usuario y logout
│   ├── sidebar/         # Menú de navegación lateral
│   ├── footer/          # Pie de página
│   └── layout/          # Contenedor principal (header + sidebar + footer + router-outlet)
└── guards/
    └── auth.guard.ts    # Guard para proteger rutas autenticadas
```

## 🔐 Protección de Rutas con Auth Guard

### Auth Guard (`guards/auth.guard.ts`)

Se utiliza `authGuard` para proteger rutas que requieren autenticación:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

### Uso en Rutas

```typescript
{
  path: '',
  component: LayoutComponent,
  canActivate: [authGuard],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'shelters', component: SheltersComponent },
    // ... más rutas protegidas
  ]
}
```

## 📄 Componentes

### 1. **Header Component** (`components/header/`)

Encabezado superior con:
- Logo y nombre de la aplicación
- Buscador
- Menú de usuario con dropdown
- Botón de logout

**Funcionalidades:**
- Muestra email del usuario autenticado
- Avatar con inicial del email
- Dropdown de opciones (Perfil, Configuración, Logout)
- Responsive en móvil

**Rutas:**
- Logo → `/dashboard`
- Perfil → `/profile`
- Configuración → `/settings`
- Logout → Limpia token y redirige a `/login`

---

### 2. **Sidebar Component** (`components/sidebar/`)

Menú de navegación lateral con:
- Links a páginas principales
- Submenús expandibles
- Botón para colapsar/expandir
- Indicador visual de página activa

**Menú Disponible:**
- 📊 Dashboard
- 🏠 Refugios
- 🐕 Mascotas
- ❤️ Adopciones
- 👥 Usuarios
- 📈 Reportes (con submenu)
  - Mascotas
  - Adopciones
- ⚙️ Configuración

**Funcionalidades:**
- Colapsable a 80px de ancho en escritorio
- Se convierte en drawer fijo en móvil
- Submenu expandible/colapsable
- Indicador visual del item activo
- Versión en la parte inferior

---

### 3. **Footer Component** (`components/footer/`)

Pie de página con:
- Información sobre Save Puppy
- Enlaces rápidos
- Enlaces a redes sociales
- Año de copyright automático

**Enlaces de Redes Sociales:**
- 🐙 GitHub
- 💼 LinkedIn
- 📘 Facebook
- 📷 Instagram

**Enlaces Rápidos:**
- Sobre Nosotros
- Privacidad
- Términos
- Contacto

---

### 4. **Layout Component** (`components/layout/`)

Contenedor principal que estructura:
```
┌─────────────────────────┐
│      HEADER             │
├──────────┬──────────────┤
│          │              │
│ SIDEBAR  │   CONTENT    │
│          │ (router-out) │
│          │              │
├──────────┴──────────────┤
│       FOOTER            │
└─────────────────────────┘
```

**Propiedades:**
- Height 100vh (full screen)
- Flex layout para distribuir espacio
- Footer se fija al botom
- Content scrollable cuando es necesario

---

## 🚦 Flujo de Autenticación

### 1. **Usuario No Autenticado**
```
/ → /login (default)
```
Solo ve el componente LoginComponent

### 2. **Usuario Autenticado**
```
/login → /dashboard (después de login exitoso)
/ → /dashboard (default si autenticado)
```
Ve el Layout (header + sidebar) + router-outlet con el contenido

### 3. **Intento Acceder a Ruta Protegida Sin Token**
```
/dashboard (sin token) → /login (por el guard)
```

---

## 🎨 Estilos y Temas

### Colores
- **Primary:** #667eea (Purple-Blue)
- **Secondary:** #764ba2 (Dark Purple)
- **Background:** #f5f7fa (Light Gray)
- **Sidebar:** #2c3e50 (Dark Blue)
- **Text Primary:** #2c3e50
- **Text Secondary:** #7f8c8d

### Responsive Design

**Desktop (> 768px):**
- Sidebar ancho (280px)
- Se puede colapsar a 80px
- Header normal

**Móvil (≤ 768px):**
- Sidebar como drawer fijo (oculto por default)
- Header compacto
- Content con padding menor
- Footer con grid single column

---

## 🔧 Rutas Disponibles

| Ruta | Componente | Protegida | Layout |
|------|-----------|-----------|---------|
| `/` | Redirect a login | ❌ | ❌ |
| `/login` | LoginComponent | ❌ | ❌ |
| `/dashboard` | DashboardComponent | ✅ | ✅ |
| `/shelters` | Dashboard (temp) | ✅ | ✅ |
| `/pets` | Dashboard (temp) | ✅ | ✅ |
| `/adoptions` | Dashboard (temp) | ✅ | ✅ |
| `/users` | Dashboard (temp) | ✅ | ✅ |
| `/reports` | Dashboard (temp) | ✅ | ✅ |
| `/settings` | Dashboard (temp) | ✅ | ✅ |
| `/profile` | Dashboard (temp) | ✅ | ✅ |

---

## 📋 Próximos Pasos

1. **Crear páginas reales** para cada sección (shelters, pets, etc.)
2. **Agregar animaciones** en transiciones de rutas
3. **Implementar lazy loading** para componentes grandes
4. **Crear interceptor HTTP** para incluir token automáticamente
5. **Agregar notificaciones** (toast/snackbar)
6. **Mejorar responsividad** en tablets

---

## 🎯 Características Implementadas

✅ Auth Guard para proteger rutas  
✅ Header con usuario y logout  
✅ Sidebar con navegación completa  
✅ Footer con información y social links  
✅ Layout contenedor  
✅ Rutas protegidas por autenticación  
✅ Responsive design  
✅ Animaciones y transiciones  
✅ Indicadores visuales de estado

---

**Última actualización:** Febrero 20, 2026
