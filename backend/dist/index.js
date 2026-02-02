"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const auth_routes_1 = __importDefault(require("./interfaces/http/routes/auth.routes"));
const mediator_1 = require("./infrastructure/shared/mediator");
const register_user_command_1 = require("./application/commands/register-user.command");
const login_user_command_1 = require("./application/commands/login-user.command");
const prisma_user_repository_1 = require("./infrastructure/repositories/prisma-user.repository");
const encryption_service_1 = require("./infrastructure/services/encryption.service");
const token_service_1 = require("./infrastructure/services/token.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
// --- Inyección de Dependencias (Manual) ---
const userRepository = new prisma_user_repository_1.PrismaUserRepository();
const encryptionService = new encryption_service_1.EncryptionService();
const tokenService = new token_service_1.TokenService();
// Registro de Handlers en el Mediador
mediator_1.mediator.register('RegisterUserCommand', new register_user_command_1.RegisterUserHandler(userRepository, encryptionService));
mediator_1.mediator.register('LoginUserCommand', new login_user_command_1.LoginUserHandler(userRepository, encryptionService, tokenService));
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});
// Rutas de la API
app.use('/api/auth', auth_routes_1.default);
// Documentación OpenAPI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
