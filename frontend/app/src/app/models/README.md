# Models Directory

Este directorio contiene las **interfaces, tipos y modelos** de datos de la aplicación móvil.

## Propósito

Define la estructura de datos que se utiliza en toda la aplicación Ionic, proporcionando type safety con TypeScript.

## Tipos de Archivos

- **Interfaces**: Estructuras de datos (`user.interface.ts`)
- **Types**: Tipos personalizados (`user.types.ts`)
- **Enums**: Enumeraciones (`user-role.enum.ts`)
- **Classes**: Modelos con lógica (`user.model.ts`)

## Convenciones de Nombres

- `*.interface.ts` - Para interfaces
- `*.type.ts` - Para types aliases
- `*.enum.ts` - Para enumeraciones
- `*.model.ts` - Para clases con lógica

## Ejemplo de Interface

```typescript
// user.interface.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}
```

## Ejemplo de Enum

```typescript
// user-role.enum.ts
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}
```

## Ejemplo de Type

```typescript
// auth.types.ts
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
  expiresIn: number;
};
```

## Ejemplo de Modelo con Lógica

```typescript
// pet.model.ts
export class Pet {
  constructor(
    public id: string,
    public name: string,
    public species: string,
    public age: number
  ) {}

  get displayName(): string {
    return `${this.name} (${this.species})`;
  }

  isAdult(): boolean {
    return this.age >= 1;
  }
}
```

## Modelos para Respuestas de API

Crear interfaces que coincidan con las respuestas del backend para mejor type safety.
