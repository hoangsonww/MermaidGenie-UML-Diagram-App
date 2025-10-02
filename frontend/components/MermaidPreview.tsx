"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MermaidPreviewProps {
  code: string;
  className?: string;
  panZoom?: boolean;
}

export function MermaidPreview({
  code,
  className,
  panZoom = true,
}: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const renderIdRef = useRef<string>(
    `template-${Math.random().toString(36).slice(2, 10)}`,
  );

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!code) return;
      setStatus("loading");
      setError(null);

      try {
        const mod = await import("mermaid");
        const mermaid = (mod.default ?? mod) as any;

        const root = document.documentElement;
        const prefersDark = root.classList.contains("dark");

        mermaid.initialize({
          startOnLoad: false,
          theme: prefersDark ? "dark" : "default",
          securityLevel: "loose",
          flowchart: { useMaxWidth: true },
        });

        const cleaned = code
          .trim()
          .replace(/^```mermaid\s*/i, "")
          .replace(/```$/i, "");

        const { svg, bindFunctions } = await mermaid.render(
          renderIdRef.current,
          cleaned,
        );

        if (cancelled) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector<SVGSVGElement>("svg");
          if (svgEl) {
            svgEl.removeAttribute("height");
            svgEl.removeAttribute("width");
            svgEl.style.width = "100%";
            svgEl.style.height = "100%";
            svgEl.style.maxWidth = "100%";
            svgEl.style.maxHeight = "100%";
            bindFunctions?.(svgEl);

            if (panZoom) {
              const panzoomMod = await import("svg-pan-zoom");
              // @ts-ignore - library ships untyped default export
              panzoomMod.default(svgEl, {
                zoomEnabled: true,
                controlIconsEnabled: false,
                fit: true,
                center: true,
              });
            }
          }
        }

        setStatus("ready");
      } catch (err: any) {
        console.error("Mermaid preview error", err);
        if (!cancelled) {
          setStatus("error");
          setError(err?.message || "Failed to render template");
        }
      }
    };

    render();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [code, panZoom]);

  const isLoading = status === "loading" || status === "idle";

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[240px] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50",
        className,
      )}
    >
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 p-4 text-center text-sm text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
