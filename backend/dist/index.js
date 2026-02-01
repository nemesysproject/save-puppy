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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
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
