"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gender_controller_1 = require("../../../controllers/gender.controller");
const router = (0, express_1.Router)();
const genderController = new gender_controller_1.GenderController();
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
exports.default = router;
