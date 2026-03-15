import jwt from "jsonwebtoken";
import type { TokenBlacklistService } from "./token-blacklist.service";

export class TokenService {
	private readonly secret: string;
	private readonly expiresIn: string;
	private tokenBlacklistService: TokenBlacklistService | null = null;

	constructor() {
		this.secret = process.env.JWT_SECRET || "default_secret";
		this.expiresIn = process.env.JWT_EXPIRES_IN || "1d";
	}

	/**
	 * Inyecta el servicio de blacklist (se hace después de la construcción)
	 */
	setBlacklistService(blacklistService: TokenBlacklistService): void {
		this.tokenBlacklistService = blacklistService;
	}

	sign(payload: object): string {
		return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
	}

	verify(token: string): any {
		// Verificar si el token está en la lista negra
		if (
			this.tokenBlacklistService &&
			this.tokenBlacklistService.isBlacklisted(token)
		) {
			throw new Error("Token ha sido invalidado");
		}

		return jwt.verify(token, this.secret);
	}
}
