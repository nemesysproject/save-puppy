/**
 * USAGE INSTRUCTIONS: How to use shared-logic guards, interceptors and services
 *
 * 1. AUTHENTICATION SERVICE
 *    Use AuthService to manage JWT tokens:
 *
 *    import { AuthService } from 'shared-logic';
 *
 *    constructor(private authService: AuthService) {}
 *
 *    // Check if authenticated
 *    if (this.authService.isAuthenticated()) { ... }
 *
 *    // Get token
 *    const token = this.authService.getToken();
 *
 *    // Set token after login
 *    this.authService.setToken(response.token, response.user);
 *
 *    // Logout
 *    this.authService.clearToken();
 *
 * 2. AUTH GUARD
 *    Protect routes from unauthorized access:
 *
 *    import { AuthGuard } from 'shared-logic';
 *
 *    // In your routing config (app.routes.ts):
 *    const routes: Routes = [
 *      { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },
 *      { path: 'login', component: LoginComponent }
 *    ];
 *
 * 3. JWT INTERCEPTOR
 *    Automatically inject JWT token in all HTTP requests:
 *
 *    import { JwtInterceptor } from 'shared-logic';
 *    import { HTTP_INTERCEPTORS } from '@angular/common/http';
 *
 *    // In app.config.ts (for standalone apps):
 *    export const appConfig: ApplicationConfig = {
 *      providers: [
 *        provideHttpClient(
 *          withInterceptors([...])
 *        ),
 *        {
 *          provide: HTTP_INTERCEPTORS,
 *          useClass: JwtInterceptor,
 *          multi: true
 *        }
 *      ]
 *    };
 *
 * 4. COMPLETE SETUP EXAMPLE
 *
 *    import { ApplicationConfig } from '@angular/core';
 *    import { provideRouter } from '@angular/router';
 *    import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
 *    import { JwtInterceptor, AuthGuard } from 'shared-logic';
 *    import { appRoutes } from './app.routes';
 *
 *    export const appConfig: ApplicationConfig = {
 *      providers: [
 *        provideRouter(appRoutes),
 *        provideHttpClient(),
 *        {
 *          provide: HTTP_INTERCEPTORS,
 *          useClass: JwtInterceptor,
 *          multi: true
 *        }
 *      ]
 *    };
 *
 *    // In your routes (app.routes.ts):
 *    export const appRoutes: Routes = [
 *      { path: '', redirectTo: '/home', pathMatch: 'full' },
 *      { path: 'login', component: LoginComponent },
 *      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
 *      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
 *    ];
 */

export interface Example {}
