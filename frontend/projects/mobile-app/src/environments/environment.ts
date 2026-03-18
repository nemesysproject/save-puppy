export const environment = {
	production: false,
	// Usamos 10.0.2.2 para que el emulador de Android pueda acceder al localhost del host
	// Nginx está en el puerto 80, por lo que no es necesario especificarlo.
	apiUrl: "http://192.168.1.137/api",
};
