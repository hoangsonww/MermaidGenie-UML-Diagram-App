/**
 * @swagger
 * components:
 *   schemas:
 *     Chart:
 *       type: object
 *       required:
 *         - title
 *         - prompt
 *         - mermaidCode
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         title:
 *           type: string
 *           description: The chart’s title
 *         prompt:
 *           type: string
 *           description: The user prompt used to generate the chart
 *         mermaidCode:
 *           type: string
 *           description: The raw Mermaid code
 *         owner:
 *           type: string
 *           description: MongoDB ObjectId of the user who owns this chart
 *         isPublic:
 *           type: boolean
 *           description: Whether this chart is publicly accessible
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the chart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the chart was last updated
 *       example:
 *         _id: "60abf9c2e1b4f45b8c8f1234"
 *         title: "User Auth Flow"
 *         prompt: "Draw a sequence diagram for login"
 *         mermaidCode: "sequenceDiagram\n    User->>Auth: POST /login\n    Auth-->>User: 200 OK"
 *         owner: "60a9f8b2c1d3e04a7c7e5678"
 *         isPublic: true
 *         createdAt: "2025-08-08T14:23:45.000Z"
 *         updatedAt: "2025-08-08T14:25:01.000Z"
 */
import mongoose from "mongoose";

export interface IChart extends mongoose.Document {
  title: string;
  prompt: string;
  mermaidCode: string;
  owner: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChartSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    mermaidCode: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Chart = mongoose.model<IChart>("Chart", ChartSchema);
