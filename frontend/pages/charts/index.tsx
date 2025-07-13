// src/pages/charts/index.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { Plus, Loader2, FilePlus } from "lucide-react";
import { toast } from "sonner";
import Head from "next/head";

interface Chart {
  _id: string;
  title: string;
  isPublic: boolean;
}

export default function ChartsPage() {
  return (
    <AuthGuard>
      <ChartsInner />
    </AuthGuard>
  );
}

function ChartsInner() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const { data, error } = useSWR<Chart[]>(token ? "/api/charts" : null, (url) =>
    api
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.data),
  );

  if (error) {
    toast.error("Failed to load charts");
    return null;
  }

  const header = (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-4xl font-extrabold">Your Charts</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Create, regenerate, or share your UML diagrams.
        </p>
      </div>
      <Link href="/charts/create">
        <Button size="sm" className="gap-1">
          <Plus size={16} /> New Chart
        </Button>
      </Link>
    </header>
  );

  if (!data) {
    return (
      <section className="w-full max-w-7xl mx-auto">
        {header}
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto">
        {header}
        <div className="flex flex-col items-center gap-6 py-24">
          <FilePlus className="text-muted-foreground" size={48} />
          <p className="text-muted-foreground text-lg">
            You haven’t created any charts yet.
          </p>
          <Link href="/charts/create">
            <Button size="md" className="px-8 py-4">
              Create your first chart
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>Your Charts - MermaidGenie</title>
        <meta
          name="description"
          content="View and manage your UML diagrams created with MermaidGenie"
        />
      </Head>
      <section className="w-full max-w-7xl mx-auto space-y-8">
        {header}
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((chart) => (
            <Link key={chart._id} href={`/charts/${chart._id}`}>
              <Card className="p-5 flex flex-col justify-between cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
                <span className="font-medium truncate">{chart.title}</span>
                <span className="text-xs mt-2">
                  {chart.isPublic ? (
                    <span className="text-primary">Public</span>
                  ) : (
                    <span className="text-muted-foreground">Private</span>
                  )}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
