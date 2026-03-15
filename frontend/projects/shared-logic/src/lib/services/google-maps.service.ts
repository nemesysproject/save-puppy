import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { take } from "rxjs/operators";

// Declaramos google para evitar errores de compilación si no están instalados los @types/google.maps
declare var google: any;

@Injectable({
	providedIn: "root",
})
export class GoogleMapsService {
	private loadedSubject = new ReplaySubject<boolean>(1);
	public loaded$: Observable<boolean> = this.loadedSubject.asObservable();
	private apiKey: string = "";

	constructor() {}

	/**
	 * Inicializa la carga del script de Google Maps.
	 * Debe llamarse en el arranque de la aplicación (AppComponent) con la API Key del entorno.
	 * @param apiKey Tu API Key de Google Maps
	 */
	public init(apiKey: string): void {
		if (this.apiKey) return; // Evitar reinicialización
		this.apiKey = apiKey;
		this.loadScript();
	}

	private loadScript(): void {
		// Si ya está cargado (por ejemplo, por otro módulo), no lo volvemos a cargar
		if (typeof google !== "undefined" && google.maps) {
			this.loadedSubject.next(true);
			return;
		}

		const script = document.createElement("script");
		// Incluimos 'places' para búsquedas y 'geometry' para cálculos de distancia
		script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			this.loadedSubject.next(true);
			console.log("✅ Google Maps SDK cargado correctamente");
		};
		script.onerror = (error) => {
			console.error("❌ Error cargando Google Maps SDK:", error);
			this.loadedSubject.next(false);
		};
		document.head.appendChild(script);
	}

	/**
	 * Promesa que se resuelve cuando la API de mapas está lista para usarse.
	 * Útil para guards o antes de inicializar un componente de mapa.
	 */
	public waitForMaps(): Promise<void> {
		return new Promise((resolve) => {
			this.loaded$.pipe(take(1)).subscribe((loaded) => {
				if (loaded) resolve();
			});
		});
	}

	// Aquí puedes agregar métodos compartidos como geocodificación, cálculo de distancias, etc.
	// Ejemplo: public getDistance(p1: any, p2: any) { ... }
}
