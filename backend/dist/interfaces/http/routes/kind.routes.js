"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kind_controller_1 = require("../../../controllers/kind.controller");
const router = (0, express_1.Router)();
const kindController = new kind_controller_1.KindController();
/**
 * @swagger
 * tags:
 *   name: Kinds
 *   description: Gestión de tipos de mascotas (Perro, Gato, etc.)
 */
/**
 * @swagger
 * /kinds:
 *   get:
 *     summary: Obtener todos los tipos de mascotas
 *     tags: [Kinds]
 *     responses:
 *       200:
 *         description: Lista de tipos
 */
router.get('/', kindController.getKinds);
exports.default = router;
