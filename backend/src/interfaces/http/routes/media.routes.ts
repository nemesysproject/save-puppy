import { Router } from 'express';
import { MediaController } from '@/controllers/media.controller';
import { upload } from '@/infrastructure/middleware/upload.middleware';
import { CloudinaryService } from '@/infrastructure/services/cloudinary.service';

const router = Router();
const cloudinaryService = new CloudinaryService();
const mediaController = new MediaController(cloudinaryService);

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Gestión de evidencia multimedia (fotos)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         url:
 *           type: string
 *         type:
 *           type: string
 *         petId:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Subir foto para una mascota
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - petId
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               petId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Foto subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 */
router.post('/', upload.single('image'), mediaController.create);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Eliminar una foto
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro multimedia
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 */
router.delete('/:id', mediaController.delete);

/**
 * @swagger
 * /api/media/pet/{petId}:
 *   get:
 *     summary: Obtener fotos de una mascota
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de fotos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 */
router.get('/pet/:petId', mediaController.getByPetId);

export default router;
