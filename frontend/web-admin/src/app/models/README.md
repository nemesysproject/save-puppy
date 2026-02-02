# Models Directory

Este directorio contiene las **interfaces, tipos y modelos** de datos de la aplicación.

## Propósito

Define la estructura de datos que se utiliza en toda la aplicación, proporcionando type safety con TypeScript.

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
};
```
