import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	const token = authService.getToken();
	if (token && !authService.isTokenExpired(token)) {
		return true;
	}

	if (token) {
		authService.clearToken();
	}

	return router.createUrlTree(["/login"]);
};
