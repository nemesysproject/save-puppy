import rateLimit from "express-rate-limit";

/**
 * Limitador para endpoints de autenticación (Login, Registro)
 * Previene ataques de fuerza bruta
 */
export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 10, // Máximo 10 peticiones por ventana
	message: {
		error: "Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos",
	},
	standardHeaders: true, // Retorna headers RateLimit-*
	legacyHeaders: false, // Desactiva X-RateLimit-*
});

/**
 * Limitador global para la API
 */
export const globalRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minuto
	max: 100, // Máximo 100 peticiones por minuto
	message: {
		error: "Límite de peticiones excedido, intente de nuevo en un minuto",
	},
	standardHeaders: true,
	legacyHeaders: false,
});
