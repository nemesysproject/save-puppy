export const environment = {
	production: false,
	// Para dispositivos Android físicos usamos la IP de la red local.
	// mDNS (hostname.local) no es soportado de forma confiable en Android.
	// Si la IP de la PC cambia, actualizar aquí.
	// Para emulador Android: usar 10.0.2.2
	apiUrl: "http://192.168.1.31/api",
};
