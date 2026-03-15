import type { NextFunction, Request, Response } from "express";
import type { TokenService } from "@/infrastructure/services/token.service";

/**
 * Middleware de autenticación JWT
 * Valida que el token JWT sea válido antes de permitir el acceso al endpoint
 */
export class AuthMiddleware {
	constructor(private tokenService: TokenService) {}

	/**
	 * Middleware para verificar autenticación
	 */
	authenticate = (req: Request, res: Response, next: NextFunction): void => {
		try {
			// Extraer token del header Authorization
			const authHeader = req.headers.authorization;

			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				res.status(401).json({ error: "Token de autenticación requerido" });
				return;
			}

			const token = authHeader.substring(7); // Remover 'Bearer '

			// Verificar el token (esto también verifica la blacklist)
			const decoded = this.tokenService.verify(token);

			// Agregar la información del usuario decodificada al request
			(req as any).user = decoded;
			(req as any).token = token;

			next();
		} catch (error: any) {
			if (error.message === "Token ha sido invalidado") {
				res.status(401).json({ error: "Token ha sido invalidado" });
			} else {
				res.status(401).json({ error: "Token inválido o expirado" });
			}
		}
	};
}
