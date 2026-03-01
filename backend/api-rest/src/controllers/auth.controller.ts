import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { RegisterUserCommand } from '@/application/commands/register-user.command';
import { LoginUserCommand } from '@/application/commands/login-user.command';
import { RefreshTokenCommand } from '@/application/commands/refresh-token.command';
import { LogoutCommand } from '@/application/commands/logout.command';

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const command = new RegisterUserCommand(email, password);
            await mediator.send('RegisterUserCommand', command);
            res.status(201).json({ message: 'Usuario registrado exitosamente (Local)' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const command = new LoginUserCommand(email, password);
            const result = await mediator.send('LoginUserCommand', command);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async googleAuth(req: Request, res: Response) {
        // TODO: Verificar token de Google y buscar/crear usuario
        res.json({ message: 'Autenticado con Google', accessToken: 'fake-jwt-token' });
    }

    async facebookAuth(req: Request, res: Response) {
        // TODO: Verificar token de Facebook y buscar/crear usuario
        res.json({ message: 'Autenticado con Facebook', accessToken: 'fake-jwt-token' });
    }

    async logout(req: Request, res: Response) {
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

            const command = new LogoutCommand(token);
            const result = await mediator.send('LogoutCommand', command);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ error: 'Token requerido' });
            }

            const command = new RefreshTokenCommand(token);
            const result = await mediator.send('RefreshTokenCommand', command);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}