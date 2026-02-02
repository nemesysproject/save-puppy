# Save Puppy - AI Coding Agent Instructions

## Project Overview

**Save Puppy** is a full-stack, polyglot platform for pet rescue, adoption, and geolocation services:

- **Backend** (`backend/`): CQRS API REST (TypeScript/Node.js, Express, PostgreSQL/MongoDB, RabbitMQ)
- **Mobile App** (`frontend/app/`): Ionic + Angular 20 (native iOS/Android via Capacitor)
- **Admin Web** (`frontend/web-admin/`): Angular 21 standalone application

---

## Backend Architecture (CQRS Pattern)

### Structure
```
backend/src/
  application/      Commands & Queries (business logic)
  domain/          Entities & Repository interfaces (business rules)
  infrastructure/  Prisma repos, services (concrete implementations)
  controllers/     HTTP orchestration layer
  interfaces/http/ Express routes
```

### CQRS Flow
1. **Commands** (`application/commands/`): Write operations → Prisma repositories → PostgreSQL
   - Format: `export class YourCommand { constructor(...) {} }` + `export class YourHandler implements IHandler<Cmd, Return> { async handle() {} }`
   - Example: [login-user.command.ts](../../backend/src/application/commands/login-user.command.ts)

2. **Queries** (`application/queries/`): Read operations (PostgreSQL today, MongoDB projections planned)
   - Example: [get-genders.query.ts](../../backend/src/application/queries/get-genders.query.ts)

3. **Mediator** ([infrastructure/shared/mediator.ts](../../backend/src/infrastructure/shared/mediator.ts)): Central dispatcher
   - Registration in [index.ts](../../backend/src/index.ts#L36-L41) at startup
   - Controllers call: `mediator.send('CommandName', commandInstance)`

### Key Patterns
- **No IoC container**: Manual dependency injection in [index.ts](../../backend/src/index.ts)
- **Repositories**: Domain interfaces (`domain/repositories/`) + Prisma implementations (`infrastructure/repositories/`)
- **Security**: bcryptjs hashing, JWT tokens (EncryptionService, TokenService)

### Backend Dev Workflow
```bash
docker-compose up -d                # PostgreSQL, MongoDB, RabbitMQ
npm run dev                         # Nodemon dev server (src/ hot reload)
npm run prisma:migrate             # Create/apply migrations
npm run build && npm start          # Production: compile + migrate + seed
```

---

## Frontend Mobile App (Ionic + Angular 20)

### Location: `frontend/app/`

### Stack
- **Framework**: Ionic Framework 8.0 + Angular 20
- **Build**: Angular CLI
- **Native Bridge**: Capacitor 8 (iOS/Android native plugins)
- **Styling**: SCSS (global.scss)
- **State**: RxJS Observables (no NgRx/Akita yet)

### Structure
```
frontend/app/src/
  app/
    app.component.ts    # Root component
    app.routes.ts       # Routing config
    folder/             # Feature modules/pages
  environments/         # API endpoint configuration
  theme/               # Ionic + custom theming
  global.scss          # Global styles
```

### Key Ionic Patterns
- **IonApp, IonMenu, IonContent, IonPage**: Layout components
- **Navigation**: Angular Router with lazy-loaded routes (ion-router-outlet)
- **Services**: HTTP via Angular HttpClient to backend API
- **Capacitor Plugins**: Status bar, keyboard, haptics, native features

### Mobile Dev Workflow
```bash
cd frontend/app
npm start                  # Dev server (ionic serve equivalent)
npm run build             # Production build
npm run lint              # ESLint + prettier check

# Build native apps (requires Xcode/Android Studio)
npx cap build ios
npx cap build android
npx cap sync              # Sync web assets to native
```

### Capacitor Integration
- Plugins declared in [capacitor.config.ts](../../frontend/app/capacitor.config.ts) (if exists)
- Run on device: `npx cap run ios` / `npx cap run android`

---

## Frontend Admin Web (Angular 21 Standalone)

### Location: `frontend/web-admin/`

### Stack
- **Framework**: Angular 21 (standalone components, no modules)
- **Build**: Angular CLI + Vite (experimental in v21)
- **Testing**: Vitest + jsdom (not Jasmine/Karma)
- **Package Manager**: npm 11.6.2 required
- **Styling**: CSS (styles.css)

### Structure
```
frontend/web-admin/src/
  app/
    app.config.ts       # Standalone bootstrap config
    app.routes.ts       # Routing (standalone)
    app.ts              # Root component
  index.html
  main.ts              # Bootstrap entry
  styles.css
```

### Standalone Components Pattern
- No NgModules: all components have `standalone: true`
- Imports declared inline: `imports: [CommonModule, FormsModule, ...]`
- Dependencies injected via `InjectionToken` or `provideX()` functions
- Routing: `Routes` array with `path`, `component`, `children`

### Web-Admin Dev Workflow
```bash
cd frontend/web-admin
npm start                 # Dev server (port 4200 default)
npm run build            # Production build
npm test                 # Vitest runner
npm run watch            # Dev mode with auto-rebuild
```

### Prettier Config
Configured in [package.json](../../frontend/web-admin/package.json): 100 char print width, single quotes, Angular HTML parser

---

## Cross-Project Integration

### API Communication
- Both frontend apps call backend REST endpoints
- Environment config: `environments/environment.ts` (mobile) + configuration in app.config.ts (web-admin)
- Auth: JWT tokens sent in `Authorization: Bearer <token>` headers

### Shared Patterns
- **API Service** pattern: Create typed services for each domain (UserService, PetService, etc.)
- **Error Handling**: Observe RxJS Observables for HTTP errors
- **Loading States**: Use RxJS `shareReplay()`, `tap()` for side effects

### Auth Flow
1. Mobile/Web calls `POST /api/auth/login` (backend)
2. Backend returns JWT token (LoginUserHandler)
3. Store token in localStorage/SecureStorage
4. Include token in all subsequent API requests

---

## Important Notes

### Monorepo Workflow
Each app is independent—separate `package.json`, build, and deploy. No shared dependencies yet.

```bash
# Root level: manage individual apps
cd backend && npm install && npm run dev
cd ../frontend/app && npm install && npm start
cd ../frontend/web-admin && npm install && npm start
```

### Future Event-Driven Sync (Backend)
- RabbitMQ prepared but not active
- MongoDB for read projections planned
- Event subscribers will sync PostgreSQL writes → MongoDB reads

### Environment Variables
Backend requires (`.env`):
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Token signing key
- `PORT`: Server port (default 3000)

---

## Quick Reference Checklist

### Adding Backend Feature
1. ✅ Define domain entity (`domain/entities/`)
2. ✅ Create repository interface (`domain/repositories/`)
3. ✅ Implement Prisma repository (`infrastructure/repositories/`)
4. ✅ Create Command/Query + Handler (`application/commands/` or `queries/`)
5. ✅ Register handler in `index.ts`
6. ✅ Create/update controller + routes
7. ✅ Update Prisma schema if needed
8. ✅ Run `npm run prisma:migrate` + commit

### Adding Mobile Feature
1. ✅ Create component/page in `app/folder/`
2. ✅ Add route in `app.routes.ts`
3. ✅ Create service for API calls
4. ✅ Import Ionic components in standalone: `imports: [IonContent, ...]`
5. ✅ Test on device with `npx cap run ios/android`

### Adding Web-Admin Feature
1. ✅ Create standalone component
2. ✅ Add route in `app.routes.ts`
3. ✅ Import required dependencies inline
4. ✅ Style with CSS (styles.css or component CSS)
5. ✅ Run `npm run build` for production

---

## Key Files

| Project | File | Purpose |
|---------|------|---------|
| Backend | [backend/prisma/schema.prisma](../../backend/prisma/schema.prisma) | Database schema source-of-truth |
| Backend | [backend/src/index.ts](../../backend/src/index.ts) | DI bootstrap + route registration |
| Backend | [backend/src/infrastructure/shared/mediator.ts](../../backend/src/infrastructure/shared/mediator.ts) | CQRS dispatcher |
| Mobile | [frontend/app/src/app/app.routes.ts](../../frontend/app/src/app/app.routes.ts) | Mobile routing config |
| Mobile | [frontend/app/src/global.scss](../../frontend/app/src/global.scss) | Mobile global styles |
| Web-Admin | [frontend/web-admin/src/app/app.config.ts](../../frontend/web-admin/src/app/app.config.ts) | Standalone config |
| Web-Admin | [frontend/web-admin/src/app/app.routes.ts](../../frontend/web-admin/src/app/app.routes.ts) | Web routing config |
