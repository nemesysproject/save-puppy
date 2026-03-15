import type { TokenService } from "@/infrastructure/services/token.service";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class RefreshTokenCommand {
	constructor(public readonly token: string) {}
}

export class RefreshTokenHandler
	implements IHandler<RefreshTokenCommand, { token: string }>
{
	constructor(private tokenService: TokenService) {}

	async handle(command: RefreshTokenCommand): Promise<{ token: string }> {
		try {
			// Verificar el token anterior
			const decoded = this.tokenService.verify(command.token);

			// Generar un nuevo token con la misma información del usuario
			const newToken = this.tokenService.sign({
				id: decoded.id,
				email: decoded.email,
				role: decoded.role,
			});

			return { token: newToken };
		} catch (error) {
			throw new Error("Token inválido o expirado");
		}
	}
}
