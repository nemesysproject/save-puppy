# AGENTS.md - Save Puppy Development Guide

## Project Overview

**Save Puppy** is a full-stack, polyglot platform for pet rescue, adoption, and geolocation services.

- **Backend** (`backend/api-rest/`): Node.js/Express CQRS API (TypeScript, PostgreSQL, MongoDB, RabbitMQ)
- **Pet Recognition Service** (`backend/pet-recognition-service/`): Python/FastAPI ML service
- **Frontend** (`frontend/`): Angular 21 + Ionic monorepo with two apps:
  - `projects/mobile-app/`: Ionic + Angular mobile app
  - `projects/web-app/`: Angular standalone web app

---

## Build/Lint/Test Commands

### Backend (CQRS API)

```bash
npm run dev                          # Nodemon hot reload
npm run build                        # Prisma generate + tsc + tsc-alias
npm run start                       # Production: migrate + seed + node
npm run prisma:migrate              # Create/apply migrations
npm run prisma:generate             # Generate Prisma client
# NOTE: No test framework configured
```

### Pet Recognition Service (Python)

```bash
cd backend/pet-recognition-service
uvicorn app.main:app --reload --port 8000
```

### Frontend (Angular/Ionic Monorepo)

```bash
cd frontend
npm start                    # Serve apps (default: web-app on port 4200)
npm start mobile-app         # Serve mobile app only
npm run build                # Build all apps
npm run build mobile-app     # Build mobile app
npm run build web-app        # Build web app
npm test                     # Run all tests (Vitest/Karma based)
npm test -- --include='**/some.spec.ts'  # Run single test file
npm run watch               # Watch mode
# NOTE: No ESLint/Prettier configured
```

### Infrastructure (Docker)

```bash
docker-compose up -d          # PostgreSQL, MongoDB, RabbitMQ, Redis
docker-compose up --build     # Full stack with all apps
docker-compose down          # Stop all services
```

---

## Code Style Guidelines

### TypeScript Backend

#### Imports
- Use path aliases with `@/` prefix (configured in tsconfig.json)
- Group: external → internal → relative
```typescript
import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { CreatePetCommand } from '@/application/commands/create-pet.command';
```

#### Naming
- **Classes**: PascalCase (`PetController`, `LoginUserCommand`)
- **Interfaces**: PascalCase with `I` prefix (`IUserRepository`, `IHandler`)
- **Methods/Variables**: camelCase
- **Files**: kebab-case (`login-user.command.ts`, `pet.controller.ts`)

#### Types
- Strict mode enabled (`strict: true` in tsconfig.json)
- Use explicit return types for public methods
- Prefer interfaces over type aliases

#### Error Handling
```typescript
try {
    const result = await mediator.send('CreatePetCommand', command);
    res.status(201).json(result);
} catch (error: any) {
    res.status(400).json({ error: error.message });
}
```

### CQRS Pattern (Backend)

**Commands** (`src/application/commands/`):
```typescript
export class CreatePetCommand {
    constructor(public readonly name: string, public readonly status: string) {}
}

export class CreatePetHandler implements IHandler<CreatePetCommand, PetEntity> {
    async handle(command: CreatePetCommand): Promise<PetEntity> { /* ... */ }
}
```
Register handlers in `src/index.ts` at startup.

### Python (Pet Recognition Service)

Follow PEP 8, use type hints, async/await with FastAPI:
```python
from fastapi import FastAPI
app = FastAPI(title="Pet Recognition Service")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### Angular Frontend

- Use standalone components (no NgModules)
- Group by feature: `pages/`, `components/`, `services/`
- Use signals: `signal()`, `computed()`, `effect()`
```typescript
@Component({ standalone: true, ... })
export class MyComponent {
    items = signal<Item[]>([]);
}
```
- Import modules inline in component `imports` array

---

## Prettier Configuration

```json
{
  "prettier": {
    "printWidth": 100,
    "singleQuote": true,
    "overrides": [{ "files": "*.html", "options": { "parser": "angular" } }]
  }
}
```

---

## Adding New Features

### Backend
1. Define entity in `src/domain/entities/`
2. Create repository interface in `src/domain/repositories/`
3. Implement Prisma repository in `src/infrastructure/repositories/`
4. Create Command/Query + Handler in `src/application/`
5. Register handler in `src/index.ts`
6. Create/update controller and routes

### Frontend
1. Create component in feature folder
2. Add route in `app.routes.ts`
3. Create service for API calls
4. Import Ionic/Angular components with standalone imports

---

## Key Files

| Project | File | Purpose |
|---------|------|---------|
| Backend | `prisma/schema.prisma` | Database schema |
| Backend | `src/index.ts` | DI bootstrap |
| Backend | `src/infrastructure/shared/mediator.ts` | CQRS dispatcher |
| Frontend | `angular.json` | Angular workspace config |
| Frontend | `projects/mobile-app/src/app/app.routes.ts` | Mobile routing |
| Frontend | `projects/web-app/src/app/app.routes.ts` | Web routing |
| Python | `backend/pet-recognition-service/app/main.py` | FastAPI app |
