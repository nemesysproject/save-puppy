import { IHandler } from '@/infrastructure/shared/mediator';
import { TokenBlacklistService } from '@/infrastructure/services/token-blacklist.service';
import { TokenService } from '@/infrastructure/services/token.service';

export class LogoutCommand {
    constructor(
        public readonly token: string
    ) { }
}

export class LogoutHandler implements IHandler<LogoutCommand, { message: string }> {
    constructor(
        private tokenService: TokenService,
        private tokenBlacklistService: TokenBlacklistService
    ) { }

    async handle(command: LogoutCommand): Promise<{ message: string }> {
        try {
            // Verificar que el token sea válido antes de agregarlo a la blacklist
            this.tokenService.verify(command.token);

            // Agregar el token a la lista negra
            this.tokenBlacklistService.addToBlacklist(command.token);

            return { message: 'Sesión cerrada correctamente' };
        } catch (error) {
            // Si el token es inválido, igual consideramos el logout exitoso
            return { message: 'Sesión cerrada correctamente' };
        }
    }
}
