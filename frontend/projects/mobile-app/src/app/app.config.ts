import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { RouteReuseStrategy, provideRouter } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { routes } from "./app.routes";
import { API_BASE_URL, JwtInterceptor } from "shared-logic";
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideRouter(routes),
		provideHttpClient(withInterceptors([JwtInterceptor])),
		importProvidersFrom(IonicModule.forRoot({})),
		// Proveemos el token con la URL del entorno correspondiente
		{ provide: API_BASE_URL, useValue: environment.apiUrl },
	],
};
