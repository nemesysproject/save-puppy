import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './interfaces/http/routes/auth.routes';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);

// Documentación OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Documentación disponible en http://localhost:${PORT}/api-docs`);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});