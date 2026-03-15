import { Router } from "express";
import { RaceController } from "@/controllers/race.controller";
import { mediator } from "@/infrastructure/shared/mediator";

const router = Router();
const raceController = new RaceController(mediator);

/**
 * @swagger
 * tags:
 *   name: Races
 *   description: Gestión completa de razas de mascotas
 */

/**
 * @swagger
 * /api/races:
 *   get:
 *     summary: Obtener todas las razas
 *     tags: [Races]
 *     responses:
 *       200:
 *         description: Lista de todas las razas
 *       401:
 *         description: No autorizado
 *     security:
 *       - bearerAuth: []
 */
router.get("/", (req, res) => raceController.getAllRaces(req, res));

/**
 * @swagger
 * /api/races:
 *   post:
 *     summary: Crear una nueva raza
 *     tags: [Races]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - kindId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Labrador
 *               kindId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Raza creada exitosamente
 *       400:
 *         description: Campos requeridos faltantes
 *       401:
 *         description: No autorizado
 *     security:
 *       - bearerAuth: []
 */
router.post("/", (req, res) => raceController.createRace(req, res));

/**
 * @swagger
 * /api/races/{id}:
 *   get:
 *     summary: Obtener una raza por ID
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la raza
 *     responses:
 *       200:
 *         description: Raza encontrada
 *       404:
 *         description: Raza no encontrada
 *       401:
 *         description: No autorizado
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", (req, res) => raceController.getRaceById(req, res));

/**
 * @swagger
 * /api/races/{id}:
 *   put:
 *     summary: Actualizar una raza
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               kindId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Raza actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", (req, res) => raceController.updateRace(req, res));

/**
 * @swagger
 * /api/races/{id}:
 *   delete:
 *     summary: Eliminar una raza
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Raza eliminada exitosamente
 *       401:
 *         description: No autorizado
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", (req, res) => raceController.deleteRace(req, res));

/**
 * @swagger
 * /api/races/by-kind/{kindId}:
 *   get:
 *     summary: Obtener razas por tipo de mascota
 *     tags: [Races]
 *     parameters:
 *       - in: path
 *         name: kindId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tipo de mascota (Kind)
 *     responses:
 *       200:
 *         description: Lista de razas para el tipo especificado
 *       401:
 *         description: No autorizado
 *     security:
 *       - bearerAuth: []
 */
router.get("/by-kind/:kindId", (req, res) =>
	raceController.getRacesByKind(req, res),
);

export default router;
