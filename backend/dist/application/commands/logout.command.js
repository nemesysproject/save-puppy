"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutHandler = exports.LogoutCommand = void 0;
class LogoutCommand {
    constructor(token) {
        this.token = token;
    }
}
exports.LogoutCommand = LogoutCommand;
class LogoutHandler {
    constructor(tokenService, tokenBlacklistService) {
        this.tokenService = tokenService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async handle(command) {
        try {
            // Verificar que el token sea válido antes de agregarlo a la blacklist
            this.tokenService.verify(command.token);
            // Agregar el token a la lista negra
            this.tokenBlacklistService.addToBlacklist(command.token);
            return { message: 'Sesión cerrada correctamente' };
        }
        catch (error) {
            // Si el token es inválido, igual consideramos el logout exitoso
            return { message: 'Sesión cerrada correctamente' };
        }
    }
}
exports.LogoutHandler = LogoutHandler;
