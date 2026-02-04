"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const mediator_1 = require("../infrastructure/shared/mediator");
const register_user_command_1 = require("../application/commands/register-user.command");
const login_user_command_1 = require("../application/commands/login-user.command");
const refresh_token_command_1 = require("../application/commands/refresh-token.command");
const logout_command_1 = require("../application/commands/logout.command");
class AuthController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const command = new register_user_command_1.RegisterUserCommand(email, password);
            await mediator_1.mediator.send('RegisterUserCommand', command);
            res.status(201).json({ message: 'Usuario registrado exitosamente (Local)' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const command = new login_user_command_1.LoginUserCommand(email, password);
            const result = await mediator_1.mediator.send('LoginUserCommand', command);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
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
        try {
            // El token puede venir en el header Authorization o en el body
            let token = req.body.token;
            if (!token) {
                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    token = authHeader.substring(7);
                }
            }
            if (!token) {
                return res.status(400).json({ error: 'Token requerido' });
            }
            const command = new logout_command_1.LogoutCommand(token);
            const result = await mediator_1.mediator.send('LogoutCommand', command);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async refreshToken(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token requerido' });
            }
            const command = new refresh_token_command_1.RefreshTokenCommand(token);
            const result = await mediator_1.mediator.send('RefreshTokenCommand', command);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
