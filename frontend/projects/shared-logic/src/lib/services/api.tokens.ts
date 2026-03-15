import { InjectionToken } from "@angular/core";

/**
 * Token para la URL base de la API.
 * Debe ser provisto en el app.config.ts o app.module.ts de la aplicación consumidora.
 */
export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");
