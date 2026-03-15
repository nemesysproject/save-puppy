import { Router } from "express";
import { UploadController } from "@/controllers/upload.controller";
import { upload } from "@/infrastructure/middleware/upload.middleware";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";

const router = Router();
const cloudinaryService = new CloudinaryService();
const uploadController = new UploadController(cloudinaryService);

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Subida de archivos
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir una imagen
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: No se proporcionó imagen
 *       500:
 *         description: Error al subir la imagen
 */
router.post("/", upload.single("image"), uploadController.upload);

export default router;
