import { Request, Response } from 'express';

export class AuthController {
    
    async register(req: Request, res: Response) {
        // TODO: Llamar al Command RegisterUser
        res.status(201).json({ message: 'Usuario registrado exitosamente (Local)' });
    }

    async login(req: Request, res: Response) {
        // TODO: Verificar credenciales y generar JWT
        res.json({ accessToken: 'fake-jwt-token', refreshToken: 'fake-refresh-token' });
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