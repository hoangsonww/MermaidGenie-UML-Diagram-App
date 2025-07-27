"use client";

import { useRouter } from "next/router";
import useSWR from "swr";
import * as htmlToImage from "html-to-image";
import { useEffect, useRef, useState, useCallback } from "react";
import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCcw,
  Save,
  Maximize2,
  Minimize2,
  Loader2,
  AlertTriangle,
  Share2,
  ArrowLeft,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Head from "next/head";

interface Chart {
  _id: string;
  title: string;
  prompt: string;
  mermaidCode: string;
  isPublic: boolean;
}

function useDebounce(fn: (...args: any[]) => void, ms: number) {
  const timer = useRef<number | null>(null);
  return useCallback(
    (...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = window.setTimeout(() => fn(...args), ms);
    },
    [fn, ms],
  );
}

export default function ChartDetail() {
  const { query } = useRouter();
  const id = Array.isArray(query.id) ? query.id[0] : query.id;
  if (!id) return null;
  return (
    <AuthGuard>
      <Detail id={id} />
    </AuthGuard>
  );
}

function Detail({ id }: { id: string }) {
  const token = localStorage.getItem("token") || "";
  const { data, error, mutate } = useSWR<Chart>(
    id ? `/api/charts/${id}` : null,
    (url: string) =>
      api
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.data),
  );

  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFs, setIsFs] = useState(false);

  const router = useRouter();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isPreviewFs, setIsPreviewFs] = useState(false);

  const togglePreviewFs = () => {
    const el = previewContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsPreviewFs(true));
    } else {
      document.exitFullscreen().then(() => setIsPreviewFs(false));
    }
  };

  const exportSvg = () => {
    const svgEl = previewRef.current?.querySelector<SVGSVGElement>("svg");
    if (!svgEl) return;
    const xml = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data?.title || "diagram"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = async () => {
    const svgEl = previewRef.current?.querySelector<SVGSVGElement>("svg");
    if (!svgEl) return;

    const disabled: CSSStyleSheet[] = [];
    for (const sheet of Array.from(document.styleSheets) as CSSStyleSheet[]) {
      try {
        sheet.cssRules;
      } catch {
        disabled.push(sheet);
        sheet.disabled = true;
      }
    }

    try {
      // @ts-ignore
      const dataUrl = await htmlToImage.toPng(svgEl, {
        cacheBust: true,
        // @ts-ignore
        filter: (node) => node === svgEl || svgEl.contains(node as Node),
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${data?.title || "diagram"}.png`;
      a.click();
    } catch (err: any) {
      console.error("PNG export error", err);
      toast.error("Failed to export PNG");
    } finally {
      disabled.forEach((s) => (s.disabled = false));
    }
  };

  useEffect(() => {
    if (!data) return;
    setPrompt(data.prompt);
    setIsPublic(data.isPublic);
    const cleaned = data.mermaidCode
      .trim()
      .replace(/^```mermaid\s*/, "")
      .replace(/```$/, "");
    setCode(cleaned);
  }, [data]);

  const renderDiagram = async (diagramCode: string) => {
    setRenderError(null);
    try {
      const mod = await import("mermaid");
      // @ts-ignore
      const mermaid = (mod.default ?? mod) as typeof import("mermaid");
      // @ts-ignore
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        flowchart: { useMaxWidth: false },
      });
      // @ts-ignore
      const { svg, bindFunctions } = await mermaid.render(
        `chart-${id}`,
        diagramCode,
      );

      if (previewRef.current) {
        previewRef.current.innerHTML = svg;
        const svgEl = previewRef.current.querySelector<SVGSVGElement>("svg");
        if (svgEl) {
          svgEl.removeAttribute("width");
          svgEl.removeAttribute("height");
          svgEl.style.maxWidth = "100%";
          svgEl.style.maxHeight = "100%";
          svgEl.style.width = "100%";
          svgEl.style.height = "100%";
          bindFunctions?.(svgEl);

          const panzoomMod = await import("svg-pan-zoom");
          panzoomMod.default(svgEl, {
            zoomEnabled: true,
            controlIconsEnabled: false,
            fit: true,
            center: true,
          });
        }
      }
    } catch (e: any) {
      console.error("Render error", e);
      setRenderError(e.message ?? String(e));
      toast.error("Diagram render failed");
    }
  };

  const debouncedRender = useDebounce(renderDiagram, 500);
  useEffect(() => {
    if (code) debouncedRender(code);
  }, [code, debouncedRender]);

  const onRegenerate = async () => {
    setBackendError(null);
    try {
      const res = await api.post(
        `/api/charts/${id}/regenerate`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const updated: Chart = res.data;
      setPrompt(updated.prompt);
      setIsPublic(updated.isPublic);
      const cleaned = updated.mermaidCode
        .trim()
        .replace(/^```mermaid\s*/, "")
        .replace(/```$/, "");
      setCode(cleaned);
      await renderDiagram(cleaned);
      toast.success("Regenerated");
    } catch (e: any) {
      console.error("Regenerate error", e);
      const msg = e.response?.data?.message || e.message || "Unknown error";
      setBackendError(msg);
      toast.error("Regenerate failed");
    }
  };

  const onSave = async () => {
    setBackendError(null);
    try {
      await api.put(
        `/api/charts/${id}`,
        { prompt, mermaidCode: code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await mutate();
      toast.success("Saved changes");
    } catch (e: any) {
      console.error("Save error", e);
      const msg = e.response?.data?.message || e.message || "Unknown error";
      setBackendError(msg);
      toast.error("Save failed");
    }
  };

  const onTogglePublic = async (value: boolean) => {
    setIsPublic(value);
    try {
      await api.put(
        `/api/charts/${id}`,
        { isPublic: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(value ? "Chart is now public" : "Chart is now private");
    } catch (e: any) {
      console.error("Toggle public error", e);
      toast.error("Failed to update visibility");
      setIsPublic(!value);
    }
  };

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFs = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() =>
        toast.error("Cannot enter fullscreen"),
      );
    } else {
      document
        .exitFullscreen()
        .catch(() => toast.error("Cannot exit fullscreen"));
    }
  };

  if (error) {
    toast.error("Failed to load chart");
    return null;
  }
  if (!data) {
    return (
      <div className="flex w-full justify-center py-24">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/charts/${id}`;

  return (
    <>
      <Head>
        <title>{data.title} Diagram - MermaidGenie</title>
        <meta name="description" content="View and edit your Mermaid diagram" />
      </Head>
      <section className="w-full flex justify-center py-8">
        <div
          ref={containerRef}
          className="w-full sm:max-w-6xl space-y-6 p-6 bg-card rounded-lg shadow-lg"
        >
          {/* Header Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{data.title}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Chart ID: {data._id}
              </p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/charts")}
                    aria-label="Back to list"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to charts list</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onTogglePublic(!isPublic)}
                    aria-label="Toggle Public"
                    className="p-4"
                  >
                    <Switch checked={isPublic} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPublic ? "Visible to anyone" : "Private (only you)"}
                </TooltipContent>
              </Tooltip>

              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={!isPublic}
                        aria-label="Share"
                      >
                        <Share2 size={16} />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPublic ? "Copy share link" : "Make public to share"}
                  </TooltipContent>
                </Tooltip>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Share this Chart</DialogTitle>
                    <DialogDescription>
                      Anyone with this link can view your chart.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 flex gap-2">
                    <input
                      readOnly
                      className="flex-1 p-2 border border-border rounded bg-background font-mono text-sm"
                      value={shareUrl}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast.success("Link copied!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        /* closes dialog automatically */
                      }}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onSave}
                    aria-label="Save"
                  >
                    <Save size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save changes</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onRegenerate}
                    aria-label="Regenerate"
                  >
                    <RefreshCcw size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Regenerate from prompt</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFs}
                    aria-label={isFs ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFs ? "Exit full screen" : "Full screen"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Prompt editor */}
          <Card className="p-4 bg-card">
            <h2 className="text-lg font-semibold mb-2">Original Prompt</h2>
            <textarea
              className="w-full p-3 border border-border rounded bg-background resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </Card>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code editor */}
            <Card className="p-4 bg-card overflow-auto">
              <h2 className="text-lg font-semibold mb-2">Mermaid Code</h2>
              <textarea
                className="w-full h-[500px] p-2 font-mono text-sm bg-background border border-border rounded resize-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Card>

            {/* Diagram preview */}
            <Card
              ref={previewContainerRef}
              className="p-4 bg-card overflow-auto relative"
            >
              {/* header with export + preview‐FS controls */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Diagram Preview</h2>
                <div className="flex gap-2">
                  {/* ...inside your Diagram Preview card header... */}
                  <Dialog>
                    <Tooltip>
                      {/* single trigger that does both: tooltip on hover + opens dialog on click */}
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            type="button" // prevent it from acting as a form submit
                            aria-label="Export diagram"
                          >
                            <Download size={16} />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Export diagram</TooltipContent>
                    </Tooltip>

                    {/* your existing dialog content: */}
                    <DialogContent className="max-w-xs">
                      <DialogHeader>
                        <DialogTitle>Export Diagram</DialogTitle>
                        <DialogDescription>
                          Choose your format
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={exportSvg}
                          className="w-full flex items-center justify-center gap-1"
                        >
                          <Download size={16} /> Export SVG
                        </Button>
                        <Button
                          type="button"
                          onClick={exportPng}
                          className="w-full flex items-center justify-center gap-1"
                        >
                          <ImageIcon size={16} /> Export PNG
                        </Button>
                      </div>
                      <DialogFooter>
                        <Button type="button">Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Preview‐only fullscreen */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={togglePreviewFs}
                      >
                        {isPreviewFs ? (
                          <Minimize2 size={16} />
                        ) : (
                          <Maximize2 size={16} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isPreviewFs
                        ? "Exit preview full screen"
                        : "Preview full screen"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* actual rendered SVG goes here */}
              <div
                ref={previewRef}
                className="w-full h-[500px] bg-background rounded"
              />
            </Card>
          </div>

          {/* Render errors from Mermaid */}
          {renderError && (
            <Card className="p-4 bg-destructive/10 border border-destructive">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">
                    Render Error:
                  </p>
                  <pre className="text-sm text-destructive whitespace-pre-wrap">
                    {renderError}
                  </pre>
                </div>
              </div>
            </Card>
          )}

          {/* Backend error (regenerate/save) */}
          {backendError && (
            <Card className="p-4 bg-destructive/10 border border-destructive">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Error:</p>
                  <p className="text-sm text-destructive">{backendError}</p>
                  <p className="mt-2 text-sm">
                    Edit prompt or code above, then click Regenerate/Save.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
