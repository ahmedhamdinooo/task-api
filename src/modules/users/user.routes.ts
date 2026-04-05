import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", userController.listUsers);

export default router;