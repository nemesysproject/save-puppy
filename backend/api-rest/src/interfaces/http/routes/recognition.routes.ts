import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Recognition
 *   description: Inteligencia Artificial para identificación y comparación de mascotas
 */

/**
 * @swagger
 * /api/recognition/analyze:
 *   post:
 *     summary: Analizar imagen de mascota para identificación
 *     description: Sube una imagen junto con filtros de búsqueda para encontrar mascotas similares en la base de datos.
 *     tags: [Recognition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la mascota (JPG, PNG)
 *               filters:
 *                 type: string
 *                 description: JSON string con filtros (kind_id, latitude, longitude, radius_km, race_id)
 *     responses:
 *       200:
 *         description: Resultados del análisis y posibles matches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pet_id:
 *                         type: string
 *                       confidence:
 *                         type: number
 *                       match_type:
 *                         type: string
 *                       last_location:
 *                         type: object
 *                 metadata:
 *                   type: object
 */

/**
 * @swagger
 * /api/recognition/compare:
 *   post:
 *     summary: Comparar dos imágenes de mascotas directamente
 *     description: Devuelve un puntaje de similitud entre dos archivos de imagen.
 *     tags: [Recognition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file1:
 *                 type: string
 *                 format: binary
 *               file2:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Puntaje de similitud (0.0 a 1.0)
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 */

export default router;
