"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    constructor() {
        this.tokenBlacklistService = null;
        this.secret = process.env.JWT_SECRET || 'default_secret';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    }
    /**
     * Inyecta el servicio de blacklist (se hace después de la construcción)
     */
    setBlacklistService(blacklistService) {
        this.tokenBlacklistService = blacklistService;
    }
    sign(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    verify(token) {
        // Verificar si el token está en la lista negra
        if (this.tokenBlacklistService && this.tokenBlacklistService.isBlacklisted(token)) {
            throw new Error('Token ha sido invalidado');
        }
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
}
exports.TokenService = TokenService;
