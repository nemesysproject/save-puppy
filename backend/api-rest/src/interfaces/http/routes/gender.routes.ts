import { Router } from 'express';
import { GenderController } from '@/controllers/gender.controller';

const router = Router();
const genderController = new GenderController();

/**
 * @swagger
 * tags:
 *   name: Genders
 *   description: Gestión de géneros de mascotas (Macho, Hembra, etc.)
 */

/**
 * @swagger
 * /api/genders:
 *   get:
 *     summary: Obtener todos los géneros de mascotas
 *     tags: [Genders]
 *     responses:
 *       200:
 *         description: Lista de géneros
 *     security:
 *       - bearerAuth: []
 */
router.get('/', genderController.getGenders);

export default router;
