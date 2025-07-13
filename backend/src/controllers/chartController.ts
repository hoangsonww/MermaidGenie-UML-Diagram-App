import { Response } from "express";
import jwt from "jsonwebtoken";
import { Chart } from "../models/Chart";
import { generateMermaidCode } from "../services/geminiService";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * Create a new chart based on user input.
 *
 * @param req - Authenticated request containing chart details.
 * @param res - Response object to send the created chart or error.
 */
export const createChart = async (req: AuthRequest, res: Response) => {
  const { title, prompt, isPublic } = req.body;
  try {
    const mermaidCode = await generateMermaidCode(prompt);
    // req.user definitely exists here
    const ownerId = (req.user!._id as any).toString();
    const chart = new Chart({
      title,
      prompt,
      mermaidCode,
      owner: ownerId,
      isPublic: !!isPublic,
    });
    await chart.save();
    res.status(201).json(chart);
  } catch (err: any) {
    console.error("createChart error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * List all charts owned by the current user.
 *
 * @param req - Authenticated request to get user charts.
 * @param res - Response object to send the list of charts or error.
 */
export const listCharts = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = (req.user!._id as any).toString();
    const charts = await Chart.find({ owner: ownerId }).sort({ createdAt: -1 });
    res.json(charts);
  } catch (err: any) {
    console.error("listCharts error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get a specific chart by ID.
 * If the chart is private, check if the user is authorized to view it.
 *
 * @param req - Request object containing the chart ID in params.
 * @param res - Response object to send the chart or error.
 */
export const getChart = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const chart = await Chart.findById(id).populate("owner", "name email");
    if (!chart) return res.status(404).json({ message: "Chart not found" });

    if (!chart.isPublic) {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });

      const token = header.split(" ")[1];
      let payload: { userId: string };
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }

      const ownerId =
        (chart.owner as any)._id?.toString() ?? (chart.owner as any).toString();
      if (payload.userId !== ownerId)
        return res.status(403).json({ message: "Forbidden" });
    }

    res.json(chart);
  } catch (err: any) {
    console.error("getChart error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Regenerate the mermaid code for a chart based on its prompt.
 * Only the owner can regenerate the chart.
 *
 * @param req - Authenticated request containing the chart ID in params.
 * @param res - Response object to send the updated chart or error.
 */
export const regenerateChart = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const chart = await Chart.findById(id);
    if (!chart) return res.status(404).json({ message: "Chart not found" });

    const ownerId = (req.user!._id as any).toString();
    if ((chart.owner as any).toString() !== ownerId)
      return res.status(403).json({ message: "Forbidden" });

    const mermaidCode = await generateMermaidCode(chart.prompt);
    chart.mermaidCode = mermaidCode;
    await chart.save();
    res.json(chart);
  } catch (err: any) {
    console.error("regenerateChart error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update an existing chart's prompt and/or mermaidCode (Save changes)
 *
 * @param req - Authenticated request containing the chart ID in params and updated data in body.
 * @param res - Response object to send the updated chart or error.
 */
export const updateChart = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { prompt, mermaidCode, title, isPublic } = req.body;

  try {
    const chart = await Chart.findById(id);
    if (!chart) {
      return res.status(404).json({ message: "Chart not found" });
    }

    // Only owner can update
    const ownerId = (req.user!._id as any).toString();
    if ((chart.owner as any).toString() !== ownerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Apply updates
    if (typeof prompt === "string") chart.prompt = prompt;
    if (typeof mermaidCode === "string") chart.mermaidCode = mermaidCode;
    if (typeof title === "string") chart.title = title;
    if (typeof isPublic === "boolean") chart.isPublic = isPublic;

    await chart.save();
    res.json(chart);
  } catch (err: any) {
    console.error("updateChart error:", err);
    res.status(500).json({ message: err.message });
  }
};
