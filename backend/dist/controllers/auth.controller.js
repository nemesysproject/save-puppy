"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    async register(req, res) {
        // TODO: Llamar al Command RegisterUser
        res.status(201).json({ message: 'Usuario registrado exitosamente (Local)' });
    }
    async login(req, res) {
        // TODO: Verificar credenciales y generar JWT
        res.json({ accessToken: 'fake-jwt-token', refreshToken: 'fake-refresh-token' });
    }
    async googleAuth(req, res) {
        // TODO: Verificar token de Google y buscar/crear usuario
        res.json({ message: 'Autenticado con Google', accessToken: 'fake-jwt-token' });
    }
    async facebookAuth(req, res) {
        // TODO: Verificar token de Facebook y buscar/crear usuario
        res.json({ message: 'Autenticado con Facebook', accessToken: 'fake-jwt-token' });
    }
    async logout(req, res) {
        // TODO: Invalidar refresh token si se almacena en BD/Redis
        res.json({ message: 'Sesión cerrada correctamente' });
    }
    async refreshToken(req, res) {
        // TODO: Verificar refresh token y emitir nuevo access token
        res.json({ accessToken: 'new-fake-jwt-token' });
    }
}
exports.AuthController = AuthController;
