/**
 * User & Authentication Models
 */

export interface User {
	id: string;
	email: string;
	role: string;
	provider: string;
	providerId?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user?: User;
}

export interface RegisterRequest {
	email: string;
	password: string;
	confirmPassword?: string;
}

export interface RegisterResponse {
	message: string;
	user?: User;
}

export interface RefreshTokenRequest {
	token: string;
}

export interface RefreshTokenResponse {
	token: string;
}

export interface LogoutRequest {
	token?: string;
}

export interface LogoutResponse {
	message: string;
}

export interface AuthResponse {
	message: string;
	accessToken: string;
	user?: User;
}
