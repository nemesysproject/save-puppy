"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
/**
 * Servicio para gestionar tokens invalidados (blacklist)
 * En una implementación en producción, esto debería usar Redis o una base de datos
 */
class TokenBlacklistService {
    constructor() {
        this.blacklistedTokens = new Set();
    }
    /**
     * Agrega un token a la lista negra
     */
    addToBlacklist(token) {
        this.blacklistedTokens.add(token);
    }
    /**
     * Verifica si un token está en la lista negra
     */
    isBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }
    /**
     * Limpia tokens expirados de la lista negra
     * Este método se puede ejecutar periódicamente para limpiar memoria
     */
    cleanup() {
        // En una implementación real, aquí se verificaría la expiración
        // y se eliminarían tokens que ya expiraron naturalmente
        // Por ahora, mantenemos todos los tokens
    }
}
exports.TokenBlacklistService = TokenBlacklistService;
