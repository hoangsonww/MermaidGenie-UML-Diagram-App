// src/pages/charts/create.tsx
"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CreateChart() {
  return (
    <AuthGuard>
      <CreateInner />
    </AuthGuard>
  );
}

function CreateInner() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isPublic, setPublic] = useState(false);
  const token = localStorage.getItem("token")!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/api/charts",
        { title, prompt, isPublic },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Chart created");
      router.push(`/charts/${data._id}`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <>
      <Head>
        <title>Create Chart • MermaidGenie</title>
        <meta
          name="description"
          content="Create a new UML diagram with MermaidGenie"
        />
      </Head>

      <section className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl space-y-8 p-8 bg-card shadow-lg rounded-lg animate-in fade-in duration-300">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold">Generate a Diagram</h1>
            <p className="text-sm text-muted-foreground">
              Describe in your natural tone - we’ll translate them into a Mermaid UML
              chart!
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 text-sm font-medium">
                Chart Title
              </label>
              <Input
                id="title"
                placeholder="E.g. School System"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Prompt */}
            <div className="flex flex-col">
              <label htmlFor="prompt" className="mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                id="prompt"
                className="w-full min-h-[8rem] resize-y rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="E.g. A Student can enroll in multiple Courses, a Course has a code and credits…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            {/* Public toggle */}
            <div className="flex items-center justify-center space-x-3">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={(val) => setPublic(val)}
              />
              <label
                htmlFor="public"
                className="text-sm font-medium select-none"
              >
                {isPublic ? "Public (anyone can view)" : "Private (only you)"}
              </label>
            </div>

            {/* Generate button */}
            <Button type="submit" className="w-full py-3 text-lg font-semibold">
              Generate
            </Button>

            {/* Back to charts */}
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/charts")}
                    aria-label="Back to charts list"
                    className="w-full py-3 text-lg font-semibold hover:shadow-none hover:bg-transparent"
                  >
                    <ArrowLeft size={20} />
                    <span className="text-sm">Back to Charts</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back to your charts</TooltipContent>
              </Tooltip>
            </div>
          </form>
        </Card>
      </section>
    </>
  );
}
