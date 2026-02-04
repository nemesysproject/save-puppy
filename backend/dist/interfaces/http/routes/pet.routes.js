"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pet_controller_1 = require("../../../controllers/pet.controller");
const router = (0, express_1.Router)();
const petController = new pet_controller_1.PetController();
/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gestión de Mascotas
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           description: LOST, ADOPTION, FOUND
 *         kindId:
 *           type: string
 *           format: uuid
 *         genderId:
 *           type: string
 *           format: uuid
 *         shelterId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         ownerEmail:
 *           type: string
 *           nullable: true
 */
/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 */
router.get('/', petController.getAll);
/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtener una mascota por ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Detalles de la mascota
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/:id', petController.getById);
/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Pets]
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
 *               - status
 *               - kindId
 *               - genderId
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               kindId:
 *                 type: string
 *               genderId:
 *                 type: string
 *               shelterId:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 */
router.post('/', petController.create);
/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Actualizar una mascota existente
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               kindId:
 *                 type: string
 *               genderId:
 *                 type: string
 *               shelterId:
 *                 type: string
 *               ownerEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada
 */
router.put('/:id', petController.update);
/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada correctamente
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/:id', petController.delete);
exports.default = router;
