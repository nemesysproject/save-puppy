"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
/**
 * Middleware de autenticación JWT
 * Valida que el token JWT sea válido antes de permitir el acceso al endpoint
 */
class AuthMiddleware {
    constructor(tokenService) {
        this.tokenService = tokenService;
        /**
         * Middleware para verificar autenticación
         */
        this.authenticate = (req, res, next) => {
            try {
                // Extraer token del header Authorization
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    res.status(401).json({ error: 'Token de autenticación requerido' });
                    return;
                }
                const token = authHeader.substring(7); // Remover 'Bearer '
                // Verificar el token (esto también verifica la blacklist)
                const decoded = this.tokenService.verify(token);
                // Agregar la información del usuario decodificada al request
                req.user = decoded;
                req.token = token;
                next();
            }
            catch (error) {
                if (error.message === 'Token ha sido invalidado') {
                    res.status(401).json({ error: 'Token ha sido invalidado' });
                }
                else {
                    res.status(401).json({ error: 'Token inválido o expirado' });
                }
            }
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
