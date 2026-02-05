"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowDown,
  Check,
  Star,
  Cpu,
  Workflow,
  Presentation,
  GitBranch,
  Zap,
  Cloud,
  ShieldCheck,
  Mail,
  FilePlus,
  Bot,
  BrushIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Head from "next/head";

function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const dur = duration;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { ref, val };
}

type CountUpStatProps = {
  label: string;
  target: number;
  suffix?: string;
  prefix?: string;
  format?: (val: number) => string;
  valueClassName?: string;
  labelClassName?: string;
  note?: string;
  className?: string;
};

function CountUpStat({
  label,
  target,
  suffix,
  prefix,
  format,
  valueClassName,
  labelClassName,
  note,
  className,
}: CountUpStatProps) {
  const { ref, val } = useCountUp(target);
  const value = format
    ? format(val)
    : `${prefix ?? ""}${val.toLocaleString()}${suffix ?? ""}`;
  return (
    <div ref={ref} className={`space-y-2 ${className ?? ""}`}>
      <p
        className={`font-extrabold tracking-tight text-primary tabular-nums ${
          valueClassName ?? "text-4xl md:text-5xl"
        }`}
      >
        {value}
      </p>
      <p className={`text-muted-foreground ${labelClassName ?? "text-sm"}`}>
        {label}
      </p>
      {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

const rotatingA = [
  "description",
  "idea",
  "thought",
  "story",
  "sketch",
  "plan",
  "concept",
  "specification",
  "requirement",
  "feature",
  "task",
  "bug",
  "issue",
  "ticket",
  "user story",
  "epic",
  "use case",
];
const rotatingB = [
  "diagram",
  "class-map",
  "model",
  "blueprint",
  "UML",
  "flowchart",
  "schema",
  "architecture",
  "design",
  "visualization",
  "map",
  "graph",
  "chart",
  "picture",
  "illustration",
  "sketch",
  "draft",
];

const heroBadges = [
  "Private by default",
  "No credit card",
  "Mermaid 11",
  "Team-ready",
  "Vercel hosted",
];

const primaryStats = [
  {
    label: "Diagrams generated",
    target: 280_000,
    suffix: "+",
  },
  {
    label: "Teams onboard",
    target: 9_200,
    suffix: "+",
  },
  {
    label: "Average rating",
    target: 49,
    format: (val: number) => `${(val / 10).toFixed(1)}★`,
  },
  {
    label: "Countries covered",
    target: 138,
  },
];

const impactStats = [
  {
    label: "Mermaid nodes rendered",
    target: 680_000,
    suffix: "+",
  },
  {
    label: "Relationships mapped",
    target: 240_000,
    suffix: "+",
  },
  {
    label: "Docs stitched to diagrams",
    target: 400_000,
    suffix: "+",
  },
  {
    label: "Hours saved by teams",
    target: 820_000,
    suffix: "+",
  },
  {
    label: "Diagram versions stored",
    target: 430_000,
    suffix: "+",
  },
  {
    label: "Median time to first draft",
    target: 42,
    suffix: "s",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Describe",
    body: "Write a short prompt or paste a spec in plain English.",
  },
  {
    step: "02",
    title: "Generate",
    body: "Gemini outputs valid Mermaid with clean naming conventions.",
  },
  {
    step: "03",
    title: "Refine",
    body: "Edit nodes, relations, and labels with live preview.",
  },
  {
    step: "04",
    title: "Share",
    body: "Export PNG/SVG or send a secure read-only link.",
  },
];

const benchmarks = [
  {
    label: "Typical time to first diagram",
    target: 23,
    format: (val: number) => `${(val / 10).toFixed(1)}s`,
  },
  {
    label: "Average render time",
    target: 18,
    format: (val: number) => `${(val / 10).toFixed(1)}s`,
  },
  {
    label: "Edit sync latency",
    target: 120,
    suffix: "ms",
  },
  {
    label: "Exports queued per minute",
    target: 1_200,
    suffix: "+",
  },
];

const governance = [
  "Private workspaces by default",
  "Shareable links with read-only access",
  "Role-based access controls",
  "Audit-ready activity timeline",
  "Diagram version history snapshots",
  "Workspace-level branding & theming",
];

const integrations = [
  "Markdown + Mermaid exports for docs",
  "Copy/paste from Jira, Linear, or Notion",
  "VS Code extension on the roadmap",
  "API-first architecture for automation",
  "Embed diagrams into internal portals",
  "Single sign-on for teams (coming)",
];

const features = [
  {
    icon: <Bot size={28} />,
    t: "AI-generated UML",
    d: "Gemini writes valid Mermaid, complete with class relationships.",
  },
  {
    icon: <Workflow size={28} />,
    t: "Prompt templates",
    d: "Save reusable prompts for recurring system patterns.",
  },
  {
    icon: <Zap size={28} />,
    t: "Instant preview",
    d: "Live Mermaid rendering with no compile or refresh delays.",
  },
  {
    icon: <GitBranch size={28} />,
    t: "Versioned diagrams",
    d: "Track changes and roll back to earlier snapshots.",
  },
  {
    icon: <Cloud size={28} />,
    t: "Workspace organization",
    d: "Projects, tags, and folders keep large catalogs tidy.",
  },
  {
    icon: <ShieldCheck size={28} />,
    t: "Privacy-first design",
    d: "Everything is private by default with secure link sharing.",
  },
  {
    icon: <FilePlus size={28} />,
    t: "Export-ready",
    d: "PNG, SVG, and Markdown exports for every diagram.",
  },
  {
    icon: <BrushIcon size={28} />,
    t: "Token-aware theming",
    d: "Light/dark modes adapt to your design system tokens.",
  },
  {
    icon: <Mail size={28} />,
    t: "Share in seconds",
    d: "Send read-only links or embed diagrams in docs.",
  },
];

const useCases = [
  {
    icon: <Workflow size={28} />,
    h: "Architecture reviews",
    p: "Replace whiteboard photos with crisp class maps.",
  },
  {
    icon: <Presentation size={28} />,
    h: "Pitch decks",
    p: "Explain systems to non-devs without lorem-ipsum UML.",
  },
  {
    icon: <Cpu size={28} />,
    h: "API design",
    p: "Model data contracts before writing a single line of code.",
  },
  {
    icon: <Star size={28} />,
    h: "Onboarding",
    p: "New hires learn your stack with interactive diagrams.",
  },
  {
    icon: <Bot size={28} />,
    h: "Documentation",
    p: "Generate UML from existing docs – no manual work.",
  },
  {
    icon: <BrushIcon size={28} />,
    h: "Design systems",
    p: "Visualize component hierarchies and relationships.",
  },
];

const techStack = [
  { icon: <Zap size={26} />, label: "Next 15" },
  { icon: <Cloud size={26} />, label: "Vercel" },
  { icon: <ShieldCheck size={26} />, label: "MongoDB Atlas" },
  { icon: <GitBranch size={26} />, label: "Mermaid 11" },
  { icon: <Cpu size={26} />, label: "Express.js" },
  { icon: <FilePlus size={26} />, label: "Node.js" },
  { icon: <Star size={26} />, label: "TypeScript" },
  { icon: <Bot size={26} />, label: "Google AI" },
  { icon: <Presentation size={26} />, label: "Tailwind CSS" },
  { icon: <BrushIcon size={26} />, label: "Shadcn UI" },
];

const testimonials = [
  {
    n: "Linh N.",
    r: "Frontend Lead",
    m: "MermaidGenie slashed our onboarding docs from pages to one neat diagram!",
  },
  {
    n: "Ethan P.",
    r: "Product Manager",
    m: "We draft flows in meetings and share links instantly. Huge time-saver.",
  },
  {
    n: "Sara A.",
    r: "Dev-Rel",
    m: "Zero learning curve. Copy Mermaid straight into markdown – done.",
  },
];

const faqs = [
  {
    q: "Is MermaidGenie free?",
    a: "Yes – every tier is 100 % free for the whole beta period.",
  },
  {
    q: "What diagram types are supported?",
    a: "Class diagrams today; sequence & ERD are coming soon.",
  },
  {
    q: "Do you store my prompts?",
    a: "Prompts + diagrams stay in your account; private by default.",
  },
  {
    q: "Can I export images?",
    a: "PNG / SVG export unlocks in the (still-free) Pro tier.",
  },
  {
    q: "Can I customize Mermaid output?",
    a: "Yes. Edit Mermaid code directly and re-render instantly.",
  },
  {
    q: "Does MermaidGenie support team workspaces?",
    a: "Yes. Workspace roles, sharing, and templates are available in Team.",
  },
];

export default function Home() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const int = setInterval(
      () => setIdx((i) => (i + 1) % rotatingA.length),
      2300,
    );
    return () => clearInterval(int);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-enabled");
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal"),
    );
    if (!elements.length) {
      return () => root.classList.remove("reveal-enabled");
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-enabled");
    };
  }, []);
  const pageTitle = "MermaidGenie – AI UML diagrams in seconds";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Turn plain English into UML class diagrams with AI."
        />
      </Head>
      <main className="page-bg relative w-full flex flex-col items-center gap-16 sm:gap-20 pb-24">
        {/*  Hero  */}
        <section className="relative w-full min-h-[100svh] p-[3px] overflow-hidden animated-border flex items-center">
          <div className="hero-surface w-full rounded-3xl py-16 md:py-20 px-6 md:px-10 text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {heroBadges.map((badge, i) => (
                <span
                  key={badge}
                  className="badge reveal"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="reveal text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              From{" "}
              <span className="text-primary transition-colors duration-500">
                {rotatingA[idx]}
              </span>{" "}
              to{" "}
              <span className="text-primary transition-colors duration-500">
                {rotatingB[idx]}
              </span>{" "}
              in seconds
            </h1>
            <p className="reveal max-w-2xl mx-auto text-lg md:text-xl mb-10 text-muted-foreground">
              MermaidGenie converts plain English into crisp UML class diagrams
              with instant previews, shared links, and export-ready assets.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="group">
                  Get started
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </Button>
              </Link>
              <Link href="/charts">
                <Button variant="outline" size="lg">
                  <Presentation size={18} />
                  My charts
                </Button>
              </Link>
              <Button variant="secondary" size="lg" asChild>
                <a href="#metrics">
                  Learn more
                  <ArrowDown size={18} />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/*  Primary stats  */}
        <section
          id="metrics"
          className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl text-center scroll-mt-16"
        >
          {primaryStats.map((stat) => (
            <CountUpStat
              key={stat.label}
              className="reveal"
              label={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              format={stat.format}
              valueClassName="text-4xl sm:text-5xl md:text-6xl"
              labelClassName="text-xs sm:text-sm"
            />
          ))}
        </section>

        {/*  Impact stats  */}
        <section className="w-full max-w-7xl px-4">
          <div className="stat-surface rounded-2xl border bg-card/80 p-8 md:p-10">
            <div className="reveal text-center mb-10">
              <p className="eyebrow">Proof at scale</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Big numbers. Clear outcomes.
              </h2>
              <p className="text-muted-foreground mt-3">
                Track adoption, velocity, and diagram quality at a glance.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {impactStats.map((stat) => (
                <CountUpStat
                  key={stat.label}
                  className="reveal"
                  label={stat.label}
                  target={stat.target}
                  suffix={stat.suffix}
                  valueClassName="text-3xl sm:text-4xl md:text-5xl"
                  labelClassName="text-xs sm:text-sm"
                />
              ))}
            </div>
          </div>
        </section>

        {/*  How it works  */}
        <section className="w-full max-w-7xl px-4">
          <div className="reveal text-center mb-10">
            <p className="eyebrow">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              From prompt to production-ready diagrams
            </h2>
            <p className="text-muted-foreground mt-3">
              A short, focused workflow designed for busy engineering teams.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="reveal rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition"
              >
                <span className="step-chip">{step.step}</span>
                <h3 className="font-semibold text-lg mt-4">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/*  Feature grid  */}
        <section className="w-full max-w-7xl px-4">
          <div className="reveal text-center mb-10">
            <p className="eyebrow">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              The full MermaidGenie toolkit
            </h2>
            <p className="text-muted-foreground mt-3">
              Everything you need to generate, refine, and share diagrams with
              confidence.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.t}
                className="reveal rounded-xl border bg-card p-8 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:border-primary/30"
              >
                <div className="icon-badge">{f.icon}</div>
                <h3 className="font-semibold text-lg mt-3">{f.t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/*  Performance snapshot  */}
        <section className="w-full max-w-7xl px-4">
          <div className="stat-surface rounded-2xl border bg-card/80 p-8 md:p-10">
            <div className="reveal text-center mb-10">
              <p className="eyebrow">Performance snapshot</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for fast iteration cycles
              </h2>
              <p className="text-muted-foreground mt-3">
                Typical results from internal beta runs and staging workloads.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {benchmarks.map((stat) => (
                <CountUpStat
                  key={stat.label}
                  className="reveal"
                  label={stat.label}
                  target={stat.target}
                  suffix={stat.suffix}
                  format={stat.format}
                  valueClassName="text-3xl sm:text-4xl md:text-5xl"
                  labelClassName="text-xs sm:text-sm"
                />
              ))}
            </div>
          </div>
        </section>

        {/*  Use-cases cards  */}
        <section className="w-full max-w-7xl px-4">
          <div className="reveal text-center mb-8">
            <p className="eyebrow">Use cases</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Where teams use Genie
            </h2>
            <p className="text-muted-foreground mt-3">
              From planning and onboarding to architecture reviews and
              stakeholder updates.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((c) => (
              <div
                key={c.h}
                className="reveal rounded-xl border bg-card shadow-sm p-8 flex flex-col gap-3 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full border bg-background">
                  {c.icon}
                </div>
                <h3 className="font-semibold">{c.h}</h3>
                <p className="text-sm text-muted-foreground">{c.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/*  Governance + integrations  */}
        <section className="w-full max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="reveal rounded-2xl border bg-card p-8 shadow-sm">
              <p className="eyebrow">Governance</p>
              <h3 className="text-2xl font-bold mt-2">
                Team controls, built in
              </h3>
              <p className="text-sm text-muted-foreground mt-3">
                Keep workspaces organized, audit-ready, and aligned with your
                team’s standards.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {governance.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal rounded-2xl border bg-card p-8 shadow-sm">
              <p className="eyebrow">Integrations</p>
              <h3 className="text-2xl font-bold mt-2">
                Fits your existing workflow
              </h3>
              <p className="text-sm text-muted-foreground mt-3">
                Embed diagrams where teams already work and move faster with
                automation.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {integrations.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/*  Tech we love  */}
        <section className="w-full max-w-6xl px-4">
          <div className="reveal text-center mb-8">
            <p className="eyebrow">Stack</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Built with modern tech
            </h2>
            <p className="text-muted-foreground mt-3">
              Reliable infrastructure designed for smooth diagram workflows.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {techStack.map((t) => (
              <div
                key={t.label}
                className="reveal flex flex-col items-center gap-1"
              >
                {t.icon}
                <span className="text-xs text-muted-foreground">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/*  Testimonials  */}
        <section className="w-full max-w-7xl px-4">
          <div className="reveal text-center mb-8">
            <p className="eyebrow">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold">Loved by devs</h2>
            <p className="text-muted-foreground mt-3">
              Teams of all sizes use MermaidGenie to communicate architecture
              faster.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.n}
                className="reveal rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition"
              >
                <Star size={18} className="text-yellow-400 mb-2" />
                <p className="mb-4">&ldquo;{t.m}&rdquo;</p>
                <p className="font-semibold">{t.n}</p>
                <p className="text-xs text-muted-foreground">{t.r}</p>
              </div>
            ))}
          </div>
        </section>

        {/*  FAQ  */}
        <section className="w-full max-w-5xl px-4">
          <div className="reveal text-center mb-8">
            <p className="eyebrow">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
          </div>
          <div className="reveal rounded-2xl border bg-background shadow-md ring-1 ring-border/60">
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b px-6 py-4 last:border-b-0 transition-colors hover:bg-accent/40 data-[state=open]:bg-accent/40"
                >
                  <AccordionTrigger className="text-left font-semibold text-base md:text-lg text-foreground hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/*  Open-source callout  */}
        <section className="w-full max-w-6xl px-4">
          <div className="reveal rounded-xl border bg-card p-10 flex flex-col md:flex-row items-center gap-6">
            <GitBranch size={36} className="text-primary shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Open-source friendly</h3>
              <p className="text-sm text-muted-foreground">
                MermaidGenie’s core libraries are MIT-licensed. Contribute on
                GitHub or fork the Gemini prompt templates for your own stack.
              </p>
            </div>
            <Link target="_blank" rel="noreferrer" href="https://github.com">
              <Button variant="outline">View repo</Button>
            </Link>
          </div>
        </section>

        {/*  CTA banner  */}
        <section className="w-full max-w-6xl rounded-xl bg-gradient-to-br from-primary via-accent to-secondary p-[2px]">
          <div className="reveal bg-background rounded-[inherit] px-8 py-14 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">
                Ready to diagram?
              </h3>
              <p className="text-muted-foreground">
                Sign in & create unlimited diagrams – free while in beta.
              </p>
            </div>
            <Link href="/charts/create">
              <Button size="lg">Start drawing</Button>
            </Link>
          </div>
        </section>

        {/*  keyframes  */}
        <style jsx>{`
          .page-bg {
            position: relative;
            z-index: 0;
          }
          .page-bg::before {
            content: "";
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image:
              radial-gradient(
                60rem 60rem at 5% -10%,
                rgba(56, 189, 248, 0.18),
                transparent 60%
              ),
              radial-gradient(
                60rem 60rem at 95% 0%,
                rgba(99, 102, 241, 0.18),
                transparent 60%
              ),
              radial-gradient(
                50rem 50rem at 50% 110%,
                rgba(34, 197, 94, 0.16),
                transparent 65%
              ),
              linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
              linear-gradient(
                90deg,
                rgba(148, 163, 184, 0.12) 1px,
                transparent 1px
              );
            background-size:
              auto,
              auto,
              auto,
              36px 36px,
              36px 36px;
            background-position: top left;
          }
          .page-bg > * {
            position: relative;
            z-index: 1;
          }
          .animated-border::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              130deg,
              var(--color-primary),
              var(--color-accent),
              var(--color-secondary),
              var(--color-primary)
            );
            background-size: 400% 400%;
            animation: border-spin 10s linear infinite;
            z-index: -1;
          }
          .hero-surface {
            position: relative;
            overflow: hidden;
          }
          .hero-surface::before,
          .hero-surface::after {
            content: "";
            position: absolute;
            width: 420px;
            height: 420px;
            border-radius: 999px;
            filter: blur(2px);
            opacity: 0.35;
            z-index: 0;
          }
          .hero-surface::before {
            top: -140px;
            left: -120px;
            background: radial-gradient(
              circle,
              rgba(56, 189, 248, 0.45),
              transparent 70%
            );
            animation: float-1 16s ease-in-out infinite;
          }
          .hero-surface::after {
            bottom: -160px;
            right: -120px;
            background: radial-gradient(
              circle,
              rgba(99, 102, 241, 0.45),
              transparent 70%
            );
            animation: float-2 18s ease-in-out infinite;
          }
          .hero-surface > * {
            position: relative;
            z-index: 1;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.4);
            background: rgba(248, 250, 252, 0.7);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.02em;
          }
          :global(.dark) .badge {
            background: rgba(15, 23, 42, 0.6);
            border-color: rgba(148, 163, 184, 0.2);
          }
          .eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 11px;
            font-weight: 600;
            color: var(--color-primary);
          }
          .icon-badge {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(99, 102, 241, 0.12);
            border: 1px solid rgba(99, 102, 241, 0.2);
            color: var(--color-primary);
          }
          .step-chip {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 28px;
            border-radius: 999px;
            background: rgba(99, 102, 241, 0.12);
            color: var(--color-primary);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.06em;
          }
          .stat-surface {
            position: relative;
            overflow: hidden;
          }
          .stat-surface::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.2),
              transparent 60%
            );
            pointer-events: none;
            z-index: 0;
          }
          .stat-surface > * {
            position: relative;
            z-index: 1;
          }
          :global(.dark) .stat-surface::after {
            background: linear-gradient(
              120deg,
              rgba(15, 23, 42, 0.35),
              transparent 60%
            );
          }
          .reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition:
              opacity 700ms ease,
              transform 700ms ease,
              filter 700ms ease;
            will-change: opacity, transform, filter;
          }
          :global(html) {
            scroll-behavior: smooth;
          }
          :global(.reveal-enabled) .reveal {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
            filter: blur(6px);
          }
          :global(.reveal-enabled) .reveal.reveal-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          @keyframes border-spin {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes float-1 {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            50% {
              transform: translate3d(20px, 18px, 0);
            }
          }
          @keyframes float-2 {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            50% {
              transform: translate3d(-18px, -12px, 0);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .reveal,
            :global(.reveal-enabled) .reveal {
              opacity: 1;
              transform: none;
              filter: none;
              transition: none;
            }
            .animated-border::before,
            .hero-surface::before,
            .hero-surface::after {
              animation: none;
            }
          }
        `}</style>
      </main>
    </>
  );
}
