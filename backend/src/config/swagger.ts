import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
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

export const swaggerSpec = swaggerJSDoc(options);