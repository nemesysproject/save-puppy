import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './interfaces/http/routes/auth.routes';
import { mediator } from './infrastructure/shared/mediator';
import { RegisterUserCommand, RegisterUserHandler } from './application/commands/register-user.command';
import { LoginUserCommand, LoginUserHandler } from './application/commands/login-user.command';
import { GetKindsHandler } from './application/queries/get-kinds.query';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PrismaKindRepository } from './infrastructure/repositories/prisma-kind.repository';
import { EncryptionService } from './infrastructure/services/encryption.service';
import { TokenService } from './infrastructure/services/token.service';
import { KindController } from './controllers/kind.controller';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Inyección de Dependencias (Manual) ---
const userRepository = new PrismaUserRepository();
const kindRepository = new PrismaKindRepository();
const encryptionService = new EncryptionService();
const tokenService = new TokenService();

// Registro de Handlers en el Mediador
mediator.register('RegisterUserCommand', new RegisterUserHandler(userRepository, encryptionService));
mediator.register('LoginUserCommand', new LoginUserHandler(userRepository, encryptionService, tokenService));
mediator.register('GetKindsQuery', new GetKindsHandler(kindRepository));

const kindController = new KindController();

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.get('/kinds', (req, res) => kindController.getKinds(req, res));

// Documentación OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});