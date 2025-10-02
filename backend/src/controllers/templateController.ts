import { Request, Response } from "express";
import { chartTemplates } from "../data/templates";
import { AuthRequest } from "../middleware/authMiddleware";
import { Chart } from "../models/Chart";

/**
 * List curated Mermaid chart templates.
 * These are static seeds that the frontend can render as previews.
 */
export const listChartTemplates = (_req: Request, res: Response) => {
  res.json(chartTemplates);
};

/**
 * Instantiate a new chart from one of the curated templates.
 * Allows overriding the title, prompt and visibility.
 */
export const createChartFromTemplate = async (
  req: AuthRequest,
  res: Response,
) => {
  const { id } = req.params;
  const { title, prompt, isPublic } = req.body as {
    title?: string;
    prompt?: string;
    isPublic?: boolean;
  };

  const template = chartTemplates.find((item) => item.id === id);
  if (!template) {
    return res.status(404).json({ message: "Template not found" });
  }

  try {
    const ownerId = (req.user!._id as any).toString();
    const chart = new Chart({
      title: typeof title === "string" && title.trim() ? title.trim() : template.title,
      prompt:
        typeof prompt === "string" && prompt.trim()
          ? prompt.trim()
          : template.prompt,
      mermaidCode: template.mermaidCode,
      owner: ownerId,
      isPublic: typeof isPublic === "boolean" ? isPublic : false,
    });

    await chart.save();

    return res.status(201).json(chart);
  } catch (error: any) {
    console.error("createChartFromTemplate error:", error);
    return res.status(500).json({ message: error.message || "Unknown error" });
  }
};
