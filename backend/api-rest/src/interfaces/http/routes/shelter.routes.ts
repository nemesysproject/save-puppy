import { Router } from "express";
import { ShelterController } from "@/controllers/shelter.controller";

const router = Router();
const shelterController = new ShelterController();

/**
 * @swagger
 * tags:
 *   name: Shelters
 *   description: Gestión de Refugios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Shelter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         capacity:
 *           type: integer
 */

/**
 * @swagger
 * /api/shelters:
 *   get:
 *     summary: Obtener todos los refugios
 *     tags: [Shelters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de refugios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shelter'
 */
router.get("/", shelterController.getAll);

/**
 * @swagger
 * /api/shelters/{id}:
 *   get:
 *     summary: Obtener un refugio por ID
 *     tags: [Shelters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del refugio
 *     responses:
 *       200:
 *         description: Detalles del refugio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelter'
 *       404:
 *         description: Refugio no encontrado
 */
router.get("/:id", shelterController.getById);

/**
 * @swagger
 * /api/shelters:
 *   post:
 *     summary: Crear un nuevo refugio
 *     tags: [Shelters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Refugio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelter'
 */
router.post("/", shelterController.create);

/**
 * @swagger
 * /api/shelters/{id}:
 *   put:
 *     summary: Actualizar un refugio existente
 *     tags: [Shelters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del refugio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Refugio actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shelter'
 *       404:
 *         description: Refugio no encontrado
 */
router.put("/:id", shelterController.update);

/**
 * @swagger
 * /api/shelters/{id}:
 *   delete:
 *     summary: Eliminar un refugio
 *     tags: [Shelters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del refugio
 *     responses:
 *       200:
 *         description: Refugio eliminado correctamente
 *       404:
 *         description: Refugio no encontrado
 */
router.delete("/:id", shelterController.delete);

export default router;
