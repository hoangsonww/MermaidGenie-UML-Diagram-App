"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
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
        const dur = 1200;
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
  }, [target]);

  return { ref, val };
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

const features = [
  {
    icon: "🤖",
    t: "AI-generated",
    d: "Gemini writes valid Mermaid – hit “Regenerate” until perfect.",
  },
  {
    icon: "🔗",
    t: "Collaboration",
    d: "Keep diagrams private or share a read-only link.",
  },
  {
    icon: "🎨",
    t: "Adaptive theme",
    d: "Light & dark – powered by your tokens.",
  },
  { icon: "🗂️", t: "Projects", d: "Unlimited workspaces to keep things tidy." },
  {
    icon: "🥷",
    t: "Privacy-first",
    d: "Your diagrams sit in your DB; we never peek.",
  },
  {
    icon: "⚡",
    t: "Blazing fast",
    d: "Pan, zoom & preview instantly – zero wait.",
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

const plans = [
  {
    tier: "Free",
    price: "$0",
    perks: ["Unlimited charts", "AI · 50 / mo", "Public links"],
  },
  {
    tier: "Pro",
    price: "$7",
    perks: [
      "Unlimited AI",
      "Version history",
      "Export PNG / SVG",
      "Priority support",
    ],
  },
  {
    tier: "Team",
    price: "$29",
    perks: ["All Pro", "Workspace roles", "SSO", "Early features"],
  },
];

const roadmap = [
  { q: "Q3 ’25", t: "Sequence diagrams" },
  { q: "Q4 ’25", t: "Real-time collaboration" },
  { q: "Q1 ’26", t: "ERD & database sync" },
  { q: "Q2 ’26", t: "VS Code extension" },
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
  const dgm = useCountUp(12000);
  const star = useCountUp(49);
  const ctrs = useCountUp(138);
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
      <main className="w-full flex flex-col items-center gap-28 pb-32">
        {/*  Hero  */}
        <section className="relative w-full max-w-6xl p-[3px] rounded-2xl overflow-hidden animated-border">
          <div className="bg-background rounded-[inherit] py-24 px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
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
            <p className="max-w-2xl mx-auto text-lg mb-12 text-muted-foreground">
              Turn everyday language into shareable UML diagrams – powered by
              Google Gemini & rendered with Mermaid.js.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="group">
                  Get started
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition"
                  />
                </Button>
              </Link>
              <Link href="/charts">
                <Button variant="outline" size="lg">
                  My charts
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/*  Stats counters  */}
        <section className="grid sm:grid-cols-3 gap-8 w-full max-w-6xl text-center">
          <div ref={dgm.ref} className="space-y-1">
            <p className="text-4xl font-extrabold text-primary">
              {dgm.val.toLocaleString()}+
            </p>
            <p className="text-muted-foreground">Diagrams generated</p>
          </div>
          <div ref={star.ref} className="space-y-1">
            <p className="text-4xl font-extrabold text-primary">
              {(star.val / 10).toFixed(1)}★
            </p>
            <p className="text-muted-foreground">Average rating</p>
          </div>
          <div ref={ctrs.ref} className="space-y-1">
            <p className="text-4xl font-extrabold text-primary">{ctrs.val}</p>
            <p className="text-muted-foreground">Countries onboard</p>
          </div>
        </section>

        {/*  Feature grid  */}
        <section className="grid lg:grid-cols-3 gap-8 w-full max-w-7xl px-4">
          {features.map((f) => (
            <div
              key={f.t}
              className="rounded-xl border bg-card p-8 shadow-sm hover:-translate-y-2 hover:shadow-lg transition"
            >
              <span className="text-4xl">{f.icon}</span>
              <h3 className="font-semibold text-lg mt-2">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </section>

        {/*  Use-cases cards  */}
        <section className="w-full max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Where teams use Genie
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((c) => (
              <div
                key={c.h}
                className="rounded-xl border bg-card shadow-sm p-8 flex flex-col gap-3 hover:shadow-lg transition"
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

        {/*  Tech we love  */}
        <section className="w-full max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Built with modern tech
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {techStack.map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1">
                {t.icon}
                <span className="text-xs text-muted-foreground">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/*  Testimonials  */}
        <section className="w-full max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Loved by devs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.n}
                className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition"
              >
                <Star size={18} className="text-yellow-400 mb-2" />
                <p className="mb-4">&ldquo;{t.m}&rdquo;</p>
                <p className="font-semibold">{t.n}</p>
                <p className="text-xs text-muted-foreground">{t.r}</p>
              </div>
            ))}
          </div>
        </section>

        {/*  Pricing  */}
        <section className="w-full max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Pricing</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            🏷️ Every tier <b>free during beta</b>. No credit card required.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div
                key={p.tier}
                className="rounded-xl border bg-card p-8 flex flex-col gap-4 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold">{p.tier}</h3>
                <p className="text-4xl font-extrabold text-primary line-through">
                  {p.price}
                </p>
                <ul className="space-y-2 text-sm">
                  {p.perks.map((per) => (
                    <li key={per} className="flex items-center gap-2">
                      <Check size={14} className="text-primary" /> {per}
                    </li>
                  ))}
                </ul>
                <Button className="mt-auto" disabled>
                  Join wait-list
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/*  Roadmap  */}
        <section className="w-full max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Roadmap</h2>
          <div className="relative pl-4 border-l">
            {roadmap.map((r) => (
              <div key={r.q} className="mb-8 flex gap-4 items-start">
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary" />
                <p className="font-semibold">{r.q}</p>
                <p className="text-muted-foreground">{r.t}</p>
              </div>
            ))}
          </div>
        </section>

        {/*  FAQ  */}
        <section className="w-full max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b py-3"
              >
                <AccordionTrigger className="font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/*  Open-source callout  */}
        <section className="w-full max-w-6xl px-4">
          <div className="rounded-xl border bg-card p-10 flex flex-col md:flex-row items-center gap-6">
            <GitBranch size={36} className="text-primary shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Open-source friendly</h3>
              <p className="text-sm text-muted-foreground">
                MermaidGenie’s core libraries are MIT-licensed. Contribute on
                GitHub or fork the Gemini prompt templates for your own stack.
              </p>
            </div>
            <Link target="_blank" href="https://github.com">
              <Button variant="outline">View repo</Button>
            </Link>
          </div>
        </section>

        {/*  Newsletter  */}
        <section className="w-full max-w-6xl rounded-xl bg-card border p-8 flex flex-col md:flex-row gap-6 items-center">
          <Mail size={32} className="text-primary shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">
              Monthly release notes • no spam
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.email as HTMLInputElement).value;
              (e.target as HTMLFormElement).reset();
              alert(`Thanks! We'll email ${email} soon.`);
            }}
            className="flex w-full md:w-auto gap-2"
          >
            <input
              name="email"
              required
              type="email"
              placeholder="you@example.com"
              className="flex-1 md:w-64 px-4 py-2 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>

        {/*  CTA banner  */}
        <section className="w-full max-w-6xl rounded-xl bg-gradient-to-br from-primary via-accent to-secondary p-[2px]">
          <div className="bg-background rounded-[inherit] px-8 py-14 flex flex-col md:flex-row gap-6 items-center justify-between">
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
        `}</style>
      </main>
    </>
  );
}
