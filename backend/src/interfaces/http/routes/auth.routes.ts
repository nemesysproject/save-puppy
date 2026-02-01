import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y gestión de sesiones
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de nuevo usuario (Email/Password)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión con credenciales locales
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna tokens
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Autenticación con Google (Login o Registro automático)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Autenticado correctamente
 */
router.post('/google', authController.googleAuth);

/**
 * @swagger
 * /auth/facebook:
 *   post:
 *     summary: Autenticación con Facebook (Login o Registro automático)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Autenticado correctamente
 */
router.post('/facebook', authController.facebookAuth);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Obtener nuevo token de acceso usando Refresh Token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Nuevo token generado
 */
router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logout);

export default router;