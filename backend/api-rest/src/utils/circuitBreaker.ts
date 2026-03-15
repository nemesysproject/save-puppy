import CircuitBreaker from "opossum";

// Configuración por defecto
const defaultOptions = {
	timeout: 3000, // Si la acción tarda más de 3s, se considera fallo
	errorThresholdPercentage: 50, // Si el 50% de las peticiones fallan, se abre el circuito
	resetTimeout: 10000, // Tiempo (ms) para intentar cerrar el circuito de nuevo (Half-Open)
};

export const createBreaker = <T>(
	action: (...args: any[]) => Promise<T>,
	name: string = "Service",
) => {
	const breaker = new CircuitBreaker(action, {
		...defaultOptions,
		name,
	});

	// Instrumentación de eventos (Logging)
	breaker.on("open", () => console.warn(`⚠️  CIRCUITO ABIERTO: ${name}`));
	breaker.on("halfOpen", () =>
		console.info(`⏳ CIRCUITO SEMI-ABIERTO: ${name} (Probando recuperación)`),
	);
	breaker.on("close", () =>
		console.info(`✅ CIRCUITO CERRADO: ${name} (Servicio recuperado)`),
	);
	breaker.on("fallback", () => console.warn(`↩️  EJECUTANDO FALLBACK: ${name}`));

	return breaker;
};
