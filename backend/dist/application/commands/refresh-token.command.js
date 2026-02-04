"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenHandler = exports.RefreshTokenCommand = void 0;
class RefreshTokenCommand {
    constructor(token) {
        this.token = token;
    }
}
exports.RefreshTokenCommand = RefreshTokenCommand;
class RefreshTokenHandler {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async handle(command) {
        try {
            // Verificar el token anterior
            const decoded = this.tokenService.verify(command.token);
            // Generar un nuevo token con la misma información del usuario
            const newToken = this.tokenService.sign({
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            });
            return { token: newToken };
        }
        catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}
exports.RefreshTokenHandler = RefreshTokenHandler;
