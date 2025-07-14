// pages/404.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export default function Custom404() {
  // Optional: fun counter or animation on 404 number
  const { ref: fourRef, val: fourVal } = useCountUp(4);
  const { ref: zeroRef, val: zeroVal } = useCountUp(0);

  return (
    <>
      <Head>
        <title>404 – Page Not Found | MermaidGenie</title>
        <meta name="description" content="Oops! The page you’re looking for doesn’t exist." />
      </Head>
      <main className="w-full min-h-screen flex flex-col items-center justify-center gap-8 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-8xl font-extrabold text-primary flex items-center justify-center gap-2">
            <span ref={fourRef}>{fourVal}</span>
            <span ref={zeroRef}>{zeroVal}</span>
            <span ref={fourRef}>{fourVal}</span>
          </h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
          </p>
          <Link href="/">
            <Button size="lg" className="group">
              Go back home
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition"
              />
            </Button>
          </Link>
        </div>
        <div className="mt-12">
          <Zap size={64} className="text-secondary animate-pulse" />
        </div>
      </main>
    </>
  );
}

function useCountUp(target: number) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 800;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return { ref, val };
}
