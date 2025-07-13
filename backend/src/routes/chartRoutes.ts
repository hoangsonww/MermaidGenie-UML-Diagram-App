// src/routes/chartRoutes.ts
import { Router } from "express";
import {
  createChart,
  getChart,
  regenerateChart,
  listCharts,
  updateChart,
} from "../controllers/chartController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Charts
 *   description: UML chart management
 */

/**
 * @swagger
 * /api/charts:
 *   post:
 *     summary: Create a new UML chart
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, prompt]
 *             properties:
 *               title:
 *                 type: string
 *               prompt:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", authenticate, createChart);

/**
 * @swagger
 * /api/charts:
 *   get:
 *     summary: List all charts owned by current user
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chart'
 */
router.get("/", authenticate, listCharts);

/**
 * @swagger
 * /api/charts/{id}:
 *   put:
 *     summary: Update an existing chart (prompt, code, title, visibility)
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Chart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *               mermaidCode:
 *                 type: string
 *               title:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated chart object
 */
router.put("/:id", authenticate, updateChart);

/**
 * @swagger
 * /api/charts/{id}:
 *   get:
 *     summary: Get a UML chart by ID
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id", getChart);

/**
 * @swagger
 * /api/charts/{id}/regenerate:
 *   post:
 *     summary: Regenerate Mermaid code for a chart
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/:id/regenerate", authenticate, regenerateChart);

export default router;
