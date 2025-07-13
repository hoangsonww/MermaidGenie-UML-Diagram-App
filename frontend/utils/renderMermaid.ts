import mermaid from "mermaid";
import { toast } from "sonner";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

export async function renderMermaid(rawCode: string, elementId: string) {
  const fenceRegex = /^```mermaid\s*([\s\S]*?)```$/;
  const match = fenceRegex.exec(rawCode.trim());
  const code = match ? match[1].trim() : rawCode.trim();

  console.debug("Mermaid code:", code);

  try {
    const { svg } = await mermaid.render(elementId, code);
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = svg;
    } else {
      console.warn(`No container found for #${elementId}, skipping render.`);
    }
  } catch (e: any) {
    console.error("Mermaid render error:", e);
    toast.error(`Diagram rendering error: ${e.str || e.message}`);
  }
}
