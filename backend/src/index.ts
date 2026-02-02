import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './interfaces/http/routes/auth.routes';
import kindRoutes from './interfaces/http/routes/kind.routes';
import { mediator } from './infrastructure/shared/mediator';
import genderRoutes from './interfaces/http/routes/gender.routes';
import { RegisterUserCommand, RegisterUserHandler } from './application/commands/register-user.command';
import { LoginUserCommand, LoginUserHandler } from './application/commands/login-user.command';
import { GetKindsHandler } from './application/queries/get-kinds.query';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PrismaKindRepository } from './infrastructure/repositories/prisma-kind.repository';
import { PrismaGenderRepository } from './infrastructure/repositories/prisma-gender.repository';
import { EncryptionService } from './infrastructure/services/encryption.service';
import { TokenService } from './infrastructure/services/token.service';
import { KindController } from './controllers/kind.controller';
import { GetGendersHandler } from './application/queries/get-genders.query';
import { GenderController } from './controllers/gender.controller';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Inyección de Dependencias (Manual) ---
const userRepository = new PrismaUserRepository();
const kindRepository = new PrismaKindRepository();
const genderRepository = new PrismaGenderRepository();
const encryptionService = new EncryptionService();
const tokenService = new TokenService();

// Registro de Handlers en el Mediador
mediator.register('RegisterUserCommand', new RegisterUserHandler(userRepository, encryptionService));
mediator.register('LoginUserCommand', new LoginUserHandler(userRepository, encryptionService, tokenService));
mediator.register('GetKindsQuery', new GetKindsHandler(kindRepository));
mediator.register('GetGendersQuery', new GetGendersHandler(genderRepository));

const kindController = new KindController();
const genderController = new GenderController();

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/kinds', kindRoutes);
app.use('/genders', genderRoutes);

// Documentación OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});