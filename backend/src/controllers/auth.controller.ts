import { Request, Response } from 'express';
import { mediator } from '@/infrastructure/shared/mediator';
import { RegisterUserCommand } from '@/application/commands/register-user.command';
import { LoginUserCommand } from '@/application/commands/login-user.command';

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
        // TODO: Invalidar refresh token si se almacena en BD/Redis
        res.json({ message: 'Sesión cerrada correctamente' });
    }

    async refreshToken(req: Request, res: Response) {
        // TODO: Verificar refresh token y emitir nuevo access token
        res.json({ accessToken: 'new-fake-jwt-token' });
    }
}