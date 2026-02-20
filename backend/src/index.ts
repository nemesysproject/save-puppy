import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './interfaces/http/routes/auth.routes';
import kindRoutes from './interfaces/http/routes/kind.routes';
import { mediator } from './infrastructure/shared/mediator';
import genderRoutes from './interfaces/http/routes/gender.routes';
import { RegisterUserCommand, RegisterUserHandler } from './application/commands/register-user.command';
import { LoginUserCommand, LoginUserHandler } from './application/commands/login-user.command';
import { RefreshTokenCommand, RefreshTokenHandler } from './application/commands/refresh-token.command';
import { LogoutCommand, LogoutHandler } from './application/commands/logout.command';
import { GetKindsHandler } from './application/queries/get-kinds.query';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PrismaKindRepository } from './infrastructure/repositories/prisma-kind.repository';
import { PrismaGenderRepository } from './infrastructure/repositories/prisma-gender.repository';
import { EncryptionService } from './infrastructure/services/encryption.service';
import { TokenService } from './infrastructure/services/token.service';
import { TokenBlacklistService } from './infrastructure/services/token-blacklist.service';
import { CloudinaryService } from './infrastructure/services/cloudinary.service';
import { RabbitMQService } from './infrastructure/services/rabbitmq.service';
import { AuthMiddleware } from './infrastructure/middleware/auth.middleware';
import { KindController } from './controllers/kind.controller';
import { GetGendersHandler } from './application/queries/get-genders.query';
import { GenderController } from './controllers/gender.controller';
import shelterRoutes from './interfaces/http/routes/shelter.routes';
import { PrismaShelterRepository } from './infrastructure/repositories/prisma-shelter.repository';
import { CreateShelterHandler, CreateShelterCommand } from './application/commands/create-shelter.command';
import { UpdateShelterHandler, UpdateShelterCommand } from './application/commands/update-shelter.command';
import { DeleteShelterHandler, DeleteShelterCommand } from './application/commands/delete-shelter.command';
import { GetSheltersHandler, GetSheltersQuery } from './application/queries/get-shelters.query';
import { GetShelterByIdHandler, GetShelterByIdQuery } from './application/queries/get-shelter-by-id.query';
import { ShelterController } from './controllers/shelter.controller';
import petRoutes from './interfaces/http/routes/pet.routes';
import { PrismaPetRepository } from './infrastructure/repositories/prisma-pet.repository';
import { CreatePetHandler, CreatePetCommand } from './application/commands/create-pet.command';
import { UpdatePetHandler, UpdatePetCommand } from './application/commands/update-pet.command';
import { DeletePetHandler, DeletePetCommand } from './application/commands/delete-pet.command';
import { GetPetsHandler, GetPetsQuery } from './application/queries/get-pets.query';
import { GetPetByIdHandler, GetPetByIdQuery } from './application/queries/get-pet-by-id.query';
import { PetController } from './controllers/pet.controller';
import uploadRoutes from './interfaces/http/routes/upload.routes';
import mediaRoutes from './interfaces/http/routes/media.routes';
import { PrismaMediaRepository } from './infrastructure/repositories/prisma-media.repository';
import { CreateMediaHandler, CreateMediaCommand } from './application/commands/create-media.command';
import { DeleteMediaHandler, DeleteMediaCommand } from './application/commands/delete-media.command';
import { GetMediaByPetHandler, GetMediaByPetQuery } from './application/queries/get-media-by-pet.query';
import { GetMediaByLocationHandler } from './application/queries/get-media-by-location.query';
import { MediaController } from './controllers/media.controller';
import { PrismaRaceRepository } from './infrastructure/repositories/prisma-race.repository';
import { GetRacesByKindHandler } from './application/queries/get-races-by-kind.query';
import { GetAllRacesHandler, GetRaceByIdHandler } from './application/queries/get-all-races.query';
import { CreateRaceHandler, CreateRaceCommand } from './application/commands/create-race.command';
import { UpdateRaceHandler, UpdateRaceCommand } from './application/commands/update-race.command';
import { DeleteRaceHandler, DeleteRaceCommand } from './application/commands/delete-race.command';
import { RaceController } from './controllers/race.controller';
import raceRoutes from './interfaces/http/routes/race.routes';

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:8200', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Inyección de Dependencias (Manual) ---
const userRepository = new PrismaUserRepository();
const kindRepository = new PrismaKindRepository();
const genderRepository = new PrismaGenderRepository();
const shelterRepository = new PrismaShelterRepository();
const petRepository = new PrismaPetRepository();
const mediaRepository = new PrismaMediaRepository();
const raceRepository = new PrismaRaceRepository();
const encryptionService = new EncryptionService();
const tokenService = new TokenService();
const tokenBlacklistService = new TokenBlacklistService();
const cloudinaryService = new CloudinaryService();
const rabbitMQService = new RabbitMQService();

// Inyectar el servicio de blacklist en el token service
tokenService.setBlacklistService(tokenBlacklistService);

// Conectar a RabbitMQ
rabbitMQService.connect();

// Crear middleware de autenticación
const authMiddleware = new AuthMiddleware(tokenService);

// Registro de Handlers en el Mediador
mediator.register('RegisterUserCommand', new RegisterUserHandler(userRepository, encryptionService));
mediator.register('LoginUserCommand', new LoginUserHandler(userRepository, encryptionService, tokenService));
mediator.register('RefreshTokenCommand', new RefreshTokenHandler(tokenService));
mediator.register('LogoutCommand', new LogoutHandler(tokenService, tokenBlacklistService));
mediator.register('GetKindsQuery', new GetKindsHandler(kindRepository));
mediator.register('GetGendersQuery', new GetGendersHandler(genderRepository));
mediator.register('CreateShelterCommand', new CreateShelterHandler(shelterRepository, rabbitMQService));
mediator.register('UpdateShelterCommand', new UpdateShelterHandler(shelterRepository));
mediator.register('DeleteShelterCommand', new DeleteShelterHandler(shelterRepository));
mediator.register('GetSheltersQuery', new GetSheltersHandler(shelterRepository));
mediator.register('GetShelterByIdQuery', new GetShelterByIdHandler(shelterRepository));
mediator.register('CreatePetCommand', new CreatePetHandler(petRepository, rabbitMQService));
mediator.register('UpdatePetCommand', new UpdatePetHandler(petRepository));
mediator.register('DeletePetCommand', new DeletePetHandler(petRepository));
mediator.register('GetPetsQuery', new GetPetsHandler(petRepository));
mediator.register('GetPetByIdQuery', new GetPetByIdHandler(petRepository));
mediator.register('CreateMediaCommand', new CreateMediaHandler(mediaRepository, rabbitMQService));
mediator.register('DeleteMediaCommand', new DeleteMediaHandler(mediaRepository, cloudinaryService));
mediator.register('GetMediaByPetQuery', new GetMediaByPetHandler(mediaRepository));
mediator.register('GetMediaByLocationQuery', new GetMediaByLocationHandler(mediaRepository));
mediator.register('GetRacesByKindQuery', new GetRacesByKindHandler(raceRepository));
mediator.register('GetAllRacesQuery', new GetAllRacesHandler(raceRepository));
mediator.register('GetRaceByIdQuery', new GetRaceByIdHandler(raceRepository));
mediator.register('CreateRaceCommand', new CreateRaceHandler(raceRepository));
mediator.register('UpdateRaceCommand', new UpdateRaceHandler(raceRepository));
mediator.register('DeleteRaceCommand', new DeleteRaceHandler(raceRepository));

const kindController = new KindController();
const genderController = new GenderController();

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/kinds', authMiddleware.authenticate, kindRoutes);
app.use('/api/genders', authMiddleware.authenticate, genderRoutes);
app.use('/api/races', authMiddleware.authenticate, raceRoutes);
app.use('/api/shelters', authMiddleware.authenticate, shelterRoutes);
app.use('/api/pets', authMiddleware.authenticate, petRoutes);
app.use('/api/upload', authMiddleware.authenticate, uploadRoutes);
app.use('/api/media', authMiddleware.authenticate, mediaRoutes);

// Documentación OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});