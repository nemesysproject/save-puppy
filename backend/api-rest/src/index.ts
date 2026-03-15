import dotenv from "dotenv";
import express from "express";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import swaggerUi from "swagger-ui-express";
import {
	CreateMediaCommand,
	CreateMediaHandler,
} from "./application/commands/create-media.command";
import {
	CreatePetCommand,
	CreatePetHandler,
} from "./application/commands/create-pet.command";
import {
	CreateRaceCommand,
	CreateRaceHandler,
} from "./application/commands/create-race.command";
import {
	CreateShelterCommand,
	CreateShelterHandler,
} from "./application/commands/create-shelter.command";
import {
	DeleteMediaCommand,
	DeleteMediaHandler,
} from "./application/commands/delete-media.command";
import {
	DeletePetCommand,
	DeletePetHandler,
} from "./application/commands/delete-pet.command";
import {
	DeleteRaceCommand,
	DeleteRaceHandler,
} from "./application/commands/delete-race.command";
import {
	DeleteShelterCommand,
	DeleteShelterHandler,
} from "./application/commands/delete-shelter.command";
import {
	LoginUserCommand,
	LoginUserHandler,
} from "./application/commands/login-user.command";
import {
	LogoutCommand,
	LogoutHandler,
} from "./application/commands/logout.command";
import {
	RefreshTokenCommand,
	RefreshTokenHandler,
} from "./application/commands/refresh-token.command";
import {
	RegisterUserCommand,
	RegisterUserHandler,
} from "./application/commands/register-user.command";
import {
	UpdatePetCommand,
	UpdatePetHandler,
} from "./application/commands/update-pet.command";
import {
	UpdateRaceCommand,
	UpdateRaceHandler,
} from "./application/commands/update-race.command";
import {
	UpdateShelterCommand,
	UpdateShelterHandler,
} from "./application/commands/update-shelter.command";
import {
	GetAllRacesHandler,
	GetRaceByIdHandler,
} from "./application/queries/get-all-races.query";
import {
	GetDashboardStatsHandler,
	GetDashboardStatsQuery,
} from "./application/queries/get-dashboard-stats.query";
import { GetGendersHandler } from "./application/queries/get-genders.query";
import { GetKindsHandler } from "./application/queries/get-kinds.query";
import { GetMediaByLocationHandler } from "./application/queries/get-media-by-location.query";
import {
	GetMediaByPetHandler,
	GetMediaByPetQuery,
} from "./application/queries/get-media-by-pet.query";
import {
	GetPetByIdHandler,
	GetPetByIdQuery,
} from "./application/queries/get-pet-by-id.query";
import {
	GetPetsHandler,
	GetPetsQuery,
} from "./application/queries/get-pets.query";
import { GetRacesByKindHandler } from "./application/queries/get-races-by-kind.query";
import {
	GetShelterByIdHandler,
	GetShelterByIdQuery,
} from "./application/queries/get-shelter-by-id.query";
import {
	GetSheltersHandler,
	GetSheltersQuery,
} from "./application/queries/get-shelters.query";
import {
	SearchPetsByLocationHandler,
	SearchPetsByLocationQuery,
} from "./application/queries/search-pets-by-location.query";
import { swaggerSpec } from "./config/swagger";
import { GenderController } from "./controllers/gender.controller";
import { KindController } from "./controllers/kind.controller";
import { MediaController } from "./controllers/media.controller";
import { PetController } from "./controllers/pet.controller";
import { RaceController } from "./controllers/race.controller";
import { ShelterController } from "./controllers/shelter.controller";
import { AuthMiddleware } from "./infrastructure/middleware/auth.middleware";
import { PrismaGenderRepository } from "./infrastructure/repositories/prisma-gender.repository";
import { PrismaKindRepository } from "./infrastructure/repositories/prisma-kind.repository";
import { PrismaMediaRepository } from "./infrastructure/repositories/prisma-media.repository";
import { PrismaPetRepository } from "./infrastructure/repositories/prisma-pet.repository";
import { PrismaRaceRepository } from "./infrastructure/repositories/prisma-race.repository";
import { PrismaShelterRepository } from "./infrastructure/repositories/prisma-shelter.repository";
import { PrismaUserRepository } from "./infrastructure/repositories/prisma-user.repository";
import { CloudinaryService } from "./infrastructure/services/cloudinary.service";
import { EncryptionService } from "./infrastructure/services/encryption.service";
import { RabbitMQService } from "./infrastructure/services/rabbitmq.service";
import { initSocketServer } from "./infrastructure/services/socket.service";
import { TokenService } from "./infrastructure/services/token.service";
import { TokenBlacklistService } from "./infrastructure/services/token-blacklist.service";
import { mediator } from "./infrastructure/shared/mediator";
import authRoutes from "./interfaces/http/routes/auth.routes";
import dashboardRoutes from "./interfaces/http/routes/dashboard.routes";
import genderRoutes from "./interfaces/http/routes/gender.routes";
import kindRoutes from "./interfaces/http/routes/kind.routes";
import mediaRoutes from "./interfaces/http/routes/media.routes";
import petRoutes from "./interfaces/http/routes/pet.routes";
import raceRoutes from "./interfaces/http/routes/race.routes";
import shelterRoutes from "./interfaces/http/routes/shelter.routes";
import uploadRoutes from "./interfaces/http/routes/upload.routes";

dotenv.config();

const app = express();

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

// Configuración de Proxy para el reconocimiento de mascotas (Python FastAPI)
const recognitionProxy = createProxyMiddleware({
	target: process.env.RECOGNITION_SERVICE_URL || "http://localhost:8000",
	changeOrigin: true,
	pathRewrite: {
		"^/api/recognition": "/api/v1/recognition", // Mapea /api/recognition a la ruta del microservicio
	},
});

// Registro de Handlers en el Mediador
mediator.register(
	"RegisterUserCommand",
	new RegisterUserHandler(userRepository, encryptionService),
);
mediator.register(
	"LoginUserCommand",
	new LoginUserHandler(userRepository, encryptionService, tokenService),
);
mediator.register("RefreshTokenCommand", new RefreshTokenHandler(tokenService));
mediator.register(
	"LogoutCommand",
	new LogoutHandler(tokenService, tokenBlacklistService),
);
mediator.register("GetKindsQuery", new GetKindsHandler(kindRepository));
mediator.register("GetGendersQuery", new GetGendersHandler(genderRepository));
mediator.register(
	"CreateShelterCommand",
	new CreateShelterHandler(shelterRepository, rabbitMQService),
);
mediator.register(
	"UpdateShelterCommand",
	new UpdateShelterHandler(shelterRepository),
);
mediator.register(
	"DeleteShelterCommand",
	new DeleteShelterHandler(shelterRepository),
);
mediator.register(
	"GetSheltersQuery",
	new GetSheltersHandler(shelterRepository),
);
mediator.register(
	"GetShelterByIdQuery",
	new GetShelterByIdHandler(shelterRepository),
);
mediator.register(
	"CreatePetCommand",
	new CreatePetHandler(petRepository, rabbitMQService),
);
mediator.register("UpdatePetCommand", new UpdatePetHandler(petRepository));
mediator.register("DeletePetCommand", new DeletePetHandler(petRepository));
mediator.register("GetPetsQuery", new GetPetsHandler(petRepository));
mediator.register("GetPetByIdQuery", new GetPetByIdHandler(petRepository));
mediator.register(
	"SearchPetsByLocationQuery",
	new SearchPetsByLocationHandler(petRepository),
);
mediator.register(
	"CreateMediaCommand",
	new CreateMediaHandler(mediaRepository, rabbitMQService),
);
mediator.register(
	"DeleteMediaCommand",
	new DeleteMediaHandler(mediaRepository, cloudinaryService),
);
mediator.register(
	"GetMediaByPetQuery",
	new GetMediaByPetHandler(mediaRepository),
);
mediator.register(
	"GetMediaByLocationQuery",
	new GetMediaByLocationHandler(mediaRepository),
);
mediator.register(
	"GetRacesByKindQuery",
	new GetRacesByKindHandler(raceRepository),
);
mediator.register("GetAllRacesQuery", new GetAllRacesHandler(raceRepository));
mediator.register("GetRaceByIdQuery", new GetRaceByIdHandler(raceRepository));
mediator.register("CreateRaceCommand", new CreateRaceHandler(raceRepository));
mediator.register("UpdateRaceCommand", new UpdateRaceHandler(raceRepository));
mediator.register("DeleteRaceCommand", new DeleteRaceHandler(raceRepository));
mediator.register("GetDashboardStatsQuery", new GetDashboardStatsHandler());

const kindController = new KindController();
const genderController = new GenderController();

app.get("/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date() });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/kinds", authMiddleware.authenticate, kindRoutes);
app.use("/api/genders", authMiddleware.authenticate, genderRoutes);
app.use("/api/races", authMiddleware.authenticate, raceRoutes);
app.use("/api/shelters", authMiddleware.authenticate, shelterRoutes);
app.use("/api/pets", authMiddleware.authenticate, petRoutes);
app.use("/api/recognition", authMiddleware.authenticate, recognitionProxy);
app.use("/api/upload", authMiddleware.authenticate, uploadRoutes);
app.use("/api/media", authMiddleware.authenticate, mediaRoutes);
app.use("/api/dashboard", authMiddleware.authenticate, dashboardRoutes);

// Documentación OpenAPI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.io
initSocketServer(server);

server.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
