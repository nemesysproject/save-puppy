"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../../../controllers/upload.controller");
const upload_middleware_1 = require("../../../infrastructure/middleware/upload.middleware");
const cloudinary_service_1 = require("../../../infrastructure/services/cloudinary.service");
const router = (0, express_1.Router)();
const cloudinaryService = new cloudinary_service_1.CloudinaryService();
const uploadController = new upload_controller_1.UploadController(cloudinaryService);
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
router.post('/', upload_middleware_1.upload.single('image'), uploadController.upload);
exports.default = router;
