// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

// Detección dinámica del host: si estamos en un navegador, usamos el hostname actual.
// Esto evita hardcodear la IP y funciona con cualquier cambio de red.
const apiHost =
	typeof window !== "undefined" ? window.location.hostname : "localhost";

export const environment = {
	production: false,
	apiUrl: `http://${apiHost}/api`,
};
