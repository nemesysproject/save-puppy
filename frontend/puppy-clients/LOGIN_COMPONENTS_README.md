# Componentes de Login - Save Puppy

Documentación de los componentes de login agregados al proyecto Save Puppy.

## 📱 Componentes Creados

### 1. **Web App Login** (`frontend/puppy-clients/projects/web-app/src/app/pages/login/`)

Componente de login para la aplicación web con Angular 21 (standalone).

**Características:**
- ✅ Validación de formulario reactivo (email y contraseña)
- ✅ Toggle de visibilidad de contraseña
- ✅ Manejo de errores con mensajes personalizados
- ✅ Estado de carga durante el envío
- ✅ Diseño responsive y moderno
- ✅ Gradiente de colores (purple-blue #667eea → #764ba2)
- ✅ Integración con AuthService (shared-logic)
- ✅ Links para registro y recuperación de contraseña

**Archivos:**
- `login.component.ts` - Lógica del componente
- `login.component.html` - Template
- `login.component.scss` - Estilos

**Ruta:** `/login`

---

### 2. **Mobile App Login** (`frontend/puppy-clients/projects/mobile-app/src/app/pages/login/`)

Componente de login para la aplicación móvil con Ionic + Angular 20 (standalone).

**Características:**
- ✅ Componentes Ionic (IonCard, IonButton, IonInput, etc.)
- ✅ Validación de formulario reactivo
- ✅ Toggle de visibilidad con iconos ionicons (eye/eye-off)
- ✅ Manejo de errores integrado
- ✅ Spinner de carga durante envío
- ✅ Diseño adaptado para móvil
- ✅ Full screen content
- ✅ Integración con AuthService (shared-logic)

**Archivos:**
- `login.component.ts` - Lógica del componente + inicialización de iconos
- `login.component.html` - Template con componentes Ionic
- `login.component.scss` - Estilos optimizados para móvil

**Ruta:** `/login`

---

## 🔐 Integración con Backend

Ambos componentes hacen llamadas HTTP a:

```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "email": "usuario@email.com",
    "role": "user",
    "provider": "local"
  }
}
```

---

## 🔑 AuthService (Compartido)

Ubicación: `frontend/puppy-clients/projects/shared-logic/src/lib/services/auth.service.ts`

**Métodos utilizados:**
- `setToken(token, user)` - Guarda el token JWT y datos del usuario
- `getCurrentUser()` - Retorna el usuario autenticado
- `isAuthenticated()` - Verifica si hay sesión activa

---

## 📝 Validaciones

### Validaciones del Formulario:

1. **Email:**
   - Requerido
   - Debe ser formato válido de email

2. **Contraseña:**
   - Requerida
   - Mínimo 6 caracteres

### Mensajes de Error:
- Validación fallida: "Por favor completa todos los campos correctamente"
- Error del servidor: Mostrado desde `error.error.message`
- Fallback: "Error al iniciar sesión. Intenta de nuevo."

---

## 🎨 Estilos y Temas

### Colores Principales:
- **Primary Gradient:** #667eea → #764ba2 (Purple-Blue)
- **Error:** #e74c3c
- **Text Dark:** #2c3e50
- **Border Color:** #e0e6ed
- **Background Light:** #f5f7fa

### Responsive:
- Web: Layout desktop con max-width 400px para la caja de login
- Mobile: Full screen con padding adaptado, colapsable en pantallas pequeñas

---

## 🚀 Uso

### Web App:
```bash
cd frontend/puppy-clients
npm start
# El login estará en http://localhost:4200/login
```

### Mobile App:
```bash
cd frontend/puppy-clients
npm start -- --project mobile-app
# O si usas ionic CLI:
# ionic serve
```

---

## 🔄 Flujo de Autenticación

1. Usuario ingresa email y contraseña
2. Se valida el formulario
3. Se envía POST a `/api/auth/login`
4. Servidor retorna JWT token y datos del usuario
5. AuthService guarda token en localStorage
6. Usuario es redirigido a `/dashboard` (web) o `/home` (mobile)
7. El token se incluye automáticamente en futuras requests (via interceptor)

---

## 📦 Dependencias Utilizadas

- `@angular/common` - CommonModule
- `@angular/forms` - ReactiveFormsModule, FormBuilder, Validators
- `@angular/router` - Router, RouterLink
- `@angular/platform-browser/http` - HttpClient
- `@ionic/angular/standalone` - Componentes Ionic (solo para mobile)
- `ionicons` - Iconos (solo para mobile)
- `rxjs` - Observable, BehaviorSubject

---

## 🔧 Próximos Pasos (Recomendados)

1. **Agregar Guard de Autenticación:**
   - Proteger rutas que requieren login
   - Redirigir a login si no hay token

2. **Componente de Registro:**
   - Crear `pages/register/register.component`
   - Integrar con endpoint `/api/auth/register`

3. **Recuperación de Contraseña:**
   - Implementar flujo de reset de contraseña
   - Crear componentes de forgot-password y reset-password

4. **Interceptor de HTTP:**
   - Agregar token a todas las requests
   - Manejar errores de autenticación (401)

5. **Mejorar Seguridad:**
   - Usar SecureStorage en mobile (Capacitor)
   - Agregar CSRF token si es necesario
   - Implementar refresh token logic

---

## 📋 Estructura de Carpetas

```
frontend/puppy-clients/
├── projects/
│   ├── web-app/
│   │   └── src/app/pages/login/
│   │       ├── login.component.ts
│   │       ├── login.component.html
│   │       └── login.component.scss
│   ├── mobile-app/
│   │   └── src/app/pages/login/
│   │       ├── login.component.ts
│   │       ├── login.component.html
│   │       └── login.component.scss
│   └── shared-logic/
│       └── src/lib/
│           ├── services/auth.service.ts
│           └── models/auth.model.ts
```

---

**Última actualización:** Febrero 19, 2026
