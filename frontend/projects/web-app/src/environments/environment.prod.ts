const apiHost =
	typeof window !== "undefined" ? window.location.hostname : "localhost";

export const environment = {
	production: true,
	apiUrl: `http://${apiHost}/api`,
};
