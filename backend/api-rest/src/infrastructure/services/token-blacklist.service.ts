import { decode } from "jsonwebtoken";

/**
 * Servicio para gestionar tokens invalidados (blacklist)
 * En una implementación en producción, esto debería usar Redis o una base de datos
 */
export class TokenBlacklistService {
	private blacklistedTokens: Set<string> = new Set();

	/**
	 * Agrega un token a la lista negra
	 */
	addToBlacklist(token: string): void {
		this.blacklistedTokens.add(token);
	}

	/**
	 * Verifica si un token está en la lista negra
	 */
	isBlacklisted(token: string): boolean {
		return this.blacklistedTokens.has(token);
	}

	/**
	 * Limpia tokens expirados de la lista negra
	 * Este método se puede ejecutar periódicamente para limpiar memoria
	 */
	cleanup(): void {
		const now = Math.floor(Date.now() / 1000);
		const unexpiredTokens = new Set<string>();

		for (const token of this.blacklistedTokens) {
			try {
				const decoded = decode(token);
				// Conservamos solo los tokens que son válidos y aún no han expirado.
				if (decoded && typeof decoded === "object" && decoded.exp && decoded.exp >= now) {
					unexpiredTokens.add(token);
				}
			} catch (error) {
				// Si el token tiene un formato inválido, simplemente no lo agregamos al nuevo Set.
				console.error(
					`Error decodificando token durante la limpieza: ${error}`,
				);
			}
		}
		this.blacklistedTokens = unexpiredTokens;
	}
}
