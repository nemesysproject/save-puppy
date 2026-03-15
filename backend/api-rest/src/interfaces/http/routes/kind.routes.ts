import { Router } from "express";
import { KindController } from "@/controllers/kind.controller";

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
 *     description: Retorna una lista de todos los tipos de mascotas disponibles con sus razas asociadas
 *     tags: [Kinds]
 *     responses:
 *       200:
 *         description: Lista de tipos de mascotas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     description: ID único del tipo de mascota
 *                   name:
 *                     type: string
 *                     description: Nombre del tipo (Perro, Gato, Otro)
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de última actualización
 *       401:
 *         description: No autorizado - Token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
router.get("/", kindController.getKinds);

export default router;
