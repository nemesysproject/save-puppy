import { Router } from 'express';
import { KindController } from '@/controllers/kind.controller';

const router = Router();
const kindController = new KindController();

/**
 * @swagger
 * tags:
 *   name: Kinds
 *   description: Gestión de tipos de mascotas (Perro, Gato, etc.)
 */

/**
 * @swagger
 * /api/kinds:
 *   get:
 *     summary: Obtener todos los tipos de mascotas
 *     tags: [Kinds]
 *     responses:
 *       200:
 *         description: Lista de tipos
 *     security:
 *       - bearerAuth: []
 */
router.get('/', kindController.getKinds);

export default router;
