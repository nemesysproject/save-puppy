"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Save Puppy API 🐾',
            version: '1.0.0',
            description: 'API Backend para el ecosistema de rescate y adopción de mascotas.',
            contact: {
                name: 'Equipo Save Puppy',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Rutas donde buscará anotaciones @swagger (ajusta según tu estructura)
    apis: ['./src/interfaces/http/**/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
