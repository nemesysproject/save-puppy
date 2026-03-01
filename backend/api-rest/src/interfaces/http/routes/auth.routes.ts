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
 * /api/auth/register:
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
 * /api/auth/login:
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
 * /api/auth/google:
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
 * /api/auth/facebook:
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
 * /api/auth/refresh-token:
 *   post:
 *     summary: Obtener nuevo token de acceso usando el token anterior
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token anterior a refrescar
 *     responses:
 *       200:
 *         description: Nuevo token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Token requerido
 *       401:
 *         description: Token inválido o expirado
 */
router.post('/refresh-token', authController.refreshToken);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión e invalidar el token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token a invalidar (opcional si se envía en el header Authorization)
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: 'Bearer token (alternativa al body)'
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Token requerido
 *       500:
 *         description: Error del servidor
 */
router.post('/logout', authController.logout);

export default router;