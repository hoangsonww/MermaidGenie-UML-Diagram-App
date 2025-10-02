"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import {
  Filter,
  Library,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MermaidPreview } from "@/components/MermaidPreview";
import api from "@/lib/api";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";

interface ChartTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  prompt: string;
  mermaidCode: string;
  tags: string[];
  recommendedPrompts: string[];
  bestFor: string;
}

const complexityOrder: Record<ChartTemplate["complexity"], number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

const fallbackTemplates: ChartTemplate[] = [
  {
    id: "system-architecture-flow",
    title: "System Architecture Overview",
    description:
      "Visualize how clients, services, and storage tiers interact in your stack.",
    category: "Flowchart",
    complexity: "Intermediate",
    prompt:
      "Create a flowchart that shows client requests travelling through the API gateway, auth service, and diagram generator before persisting to MongoDB and object storage.",
    mermaidCode: `graph LR
      subgraph Clients
        Browser[Web Client]
        Mobile[Mobile App]
      end
      subgraph Edge
        CDN[CDN & WAF]
        APIGateway[API Gateway]
      end
      subgraph Services
        AuthService[Auth Service]
        DiagramService[Diagram Service]
        TemplateSvc[Template Service]
      end
      subgraph Data["Data & Storage"]
        Mongo[(MongoDB)]
        Storage[(Object Storage)]
        Cache[(Redis Cache)]
        Analytics[(Analytics Warehouse)]
      end
      Browser -->|HTTPS| CDN
      Mobile -->|HTTPS| CDN
      CDN --> APIGateway
      APIGateway --> AuthService
      APIGateway --> DiagramService
      DiagramService --> TemplateSvc
      DiagramService --> Mongo
      DiagramService --> Storage
      TemplateSvc --> Cache
      Mongo --> Analytics
      Storage --> Analytics
      Cache --> Analytics`,
    tags: ["architecture", "flow", "services"],
    recommendedPrompts: [
      "Show how our web app, API gateway and microservices interact",
      "Map the data flow from mobile clients to storage",
    ],
    bestFor: "Kickstarting system design docs and onboarding decks.",
  },
  {
    id: "ai-generation-sequence",
    title: "AI Generation Lifecycle",
    description:
      "Explain what happens when a user requests an AI-generated diagram.",
    category: "Sequence",
    complexity: "Beginner",
    prompt:
      "Draft a sequence diagram that captures the round-trip from a user's prompt to the rendered diagram including the AI service and database save.",
    mermaidCode: `sequenceDiagram
      participant User
      participant WebApp
      participant API
      participant AISvc as AI Service
      participant Validator as Policy Guardrails
      participant DB
      participant Audit as Audit Log
      User->>WebApp: Submit diagram prompt
      WebApp->>API: POST /charts
      API->>Validator: Validate prompt & auth
      Validator-->>API: Policy decision
      API->>AISvc: Generate Mermaid code
      AISvc-->>API: Mermaid code response
      API->>DB: Persist chart record
      API->>Audit: Append activity trail
      API-->>WebApp: Chart payload
      WebApp-->>User: Render diagram`,
    tags: ["sequence", "ai", "lifecycle"],
    recommendedPrompts: [
      "Illustrate how our AI pipeline handles requests",
      "Show the round-trip from prompt to rendered diagram",
    ],
    bestFor: "Product explainers and incident post-mortems.",
  },
  {
    id: "uml-data-model",
    title: "UML Data Model",
    description:
      "Capture core collections in the MermaidGenie database schema.",
    category: "Class",
    complexity: "Intermediate",
    prompt:
      "Model the UML classes for users, charts, and versions, including key properties and relationships.",
    mermaidCode: `classDiagram
    class User {
      +ObjectId _id
      +string name
      +string email
      +string passwordHash
      +Date createdAt
    }
    class Chart {
      +ObjectId _id
      +string title
      +string prompt
      +string mermaidCode
      +boolean isPublic
      +Date createdAt
    }
    class Version {
      +ObjectId _id
      +ObjectId chartId
      +string mermaidCode
      +Date createdAt
    }
    User "1" --> "*" Chart : owns
    Chart "1" --> "*" Version : history`,
    tags: ["uml", "database", "schema"],
    recommendedPrompts: [
      "Show the relationship between users, charts and versions",
      "Document the core data model for MermaidGenie",
    ],
    bestFor: "Architecture reviews and engineering hand-offs.",
  },
  {
    id: "diagram-review-state",
    title: "Diagram Review Workflow",
    description:
      "Track the lifecycle from drafting to publishing a diagram.",
    category: "State",
    complexity: "Beginner",
    prompt:
      "Create a state machine for a diagram that starts in draft, gets generated, reviewed, shared publicly and eventually archived.",
    mermaidCode: `stateDiagram-v2
    [*] --> Draft
    Draft --> Generating: Submit prompt
    Generating --> Review: Mermaid ready
    Review --> Published: Toggle public
    Published --> Archived: Retire diagram
    Archived --> Draft: Restore edits`,
    tags: ["workflow", "lifecycle", "governance"],
    recommendedPrompts: [
      "Outline the review process for diagrams",
      "Show how a chart moves from draft to published",
    ],
    bestFor: "Team processes and playbooks.",
  },
  {
    id: "roadmap-mindmap",
    title: "Product Roadmap Mind Map",
    description: "Map roadmap initiatives across upcoming sprints.",
    category: "Mindmap",
    complexity: "Beginner",
    prompt:
      "Build a mind map for a product roadmap that includes sprints, backlog items and research tracks.",
    mermaidCode: `mindmap
  root((Product Roadmap))
    Sprint 1
      Diagram Editor polish
      Template catalog
    Sprint 2
      Collaboration beta
      Export automation
    Sprint 3
      Analytics dashboard
      VS Code extension
    Backlog
      Research: Diagram diffing
      Research: Data import`,
    tags: ["product", "planning", "mindmap"],
    recommendedPrompts: [
      "Brainstorm roadmap initiatives",
      "Map product workstreams for the quarter",
    ],
    bestFor: "Workshops and prioritisation sessions.",
  },
  {
    id: "onboarding-journey",
    title: "Customer Onboarding Journey",
    description:
      "Communicate the first-week experience for new MermaidGenie teams.",
    category: "Journey",
    complexity: "Advanced",
    prompt:
      "Design a user journey that highlights sign-up, first diagram creation, sharing, and long-term activation milestones.",
    mermaidCode: `journey
    title MermaidGenie Onboarding Journey
    section Sign Up
      Discover MermaidGenie: 5:Marketing Site
      Create account: 3:User
      Verify email: 2:System
    section First Diagram
      Explore templates: 4:User
      Generate AI draft: 3:AI
      Share to Slack: 2:User
    section Activation
      Invite teammates: 3:User
      Publish team workspace: 2:System
      Review analytics: 1:Product`,
    tags: ["journey", "customer", "activation"],
    recommendedPrompts: [
      "Show the onboarding flow for a new customer",
      "Illustrate the first 30 days for a trial team",
    ],
    bestFor: "Customer success and marketing storytelling.",
  },
  {
    id: "cloud-network-topology",
    title: "Cloud Network Topology",
    description:
      "Map how edge routing, application tiers, and data services connect in the cloud.",
    category: "Flowchart",
    complexity: "Intermediate",
    prompt:
      "Sketch a cloud deployment showing global load balancers, web/API tiers, background workers, cache, and storage services.",
    mermaidCode: `graph LR
      Users((Global Users)) --> LB[Global Load Balancer]
      LB --> Web[Web Tier]
      Web --> API[API Tier]
      API --> Cache[(Redis Cache)]
      API --> PrimaryDB[(Primary Database)]
      PrimaryDB --> Replica[(Read Replica)]
      API --> Queue[(Task Queue)]
      Queue --> Workers[Async Workers]
      Workers --> Storage[(Object Storage)]
      Workers --> Analytics[(Analytics Warehouse)]`,
    tags: ["cloud", "infrastructure", "network"],
    recommendedPrompts: [
      "Show the production network layout for our SaaS",
      "Explain how traffic flows through our cloud stack",
    ],
    bestFor: "Runbooks, architecture reviews, and onboarding decks.",
  },
  {
    id: "ci-cd-pipeline",
    title: "CI/CD Delivery Pipeline",
    description: "Describe automated checks from commit to production deployment.",
    category: "Flowchart",
    complexity: "Beginner",
    prompt:
      "Document the CI/CD workflow covering commit hooks, tests, build artefacts, approvals, and release steps.",
    mermaidCode: `graph TD
      Dev[Developer Commit] --> Lint[Lint & Type Check]
      Lint --> Tests[Unit & Integration Tests]
      Tests --> Build[Build Docker Image]
      Build --> Scan[Security Scan]
      Scan --> Staging[Deploy to Staging]
      Staging --> Review[Manual QA]
      Review --> Prod[Deploy to Production]
      Prod --> Monitor[Observability & Alerts]
      Monitor --> Feedback[Feedback Loop]`,
    tags: ["delivery", "pipeline", "devops"],
    recommendedPrompts: [
      "Visualise the CI/CD stages for our service",
      "Share how code travels from commit to production",
    ],
    bestFor: "Engineering playbooks and release documentation.",
  },
  {
    id: "microservice-context",
    title: "Microservice Context Map",
    description: "Highlight bounded contexts and shared contracts between services.",
    category: "Flowchart",
    complexity: "Advanced",
    prompt:
      "Create a context map showing user, billing, notification, and analytics services plus the contracts they share.",
    mermaidCode: `graph LR
      UserSvc[User Service] --- AuthContract((Auth Contract))
      BillingSvc[Billing Service] --- AuthContract
      UserSvc --- ProfileContract((Profile Events))
      NotifySvc[Notification Service] --- ProfileContract
      BillingSvc --- InvoiceContract((Invoice Webhooks))
      NotifySvc --- MessageBus[(Event Bus)]
      AnalyticsSvc[Analytics Service] --- MessageBus
      AnalyticsSvc --- ReportingContract((Reporting API))
      BillingSvc --- ReportingContract`,
    tags: ["microservices", "context", "ddd"],
    recommendedPrompts: [
      "Show how our services collaborate and share contracts",
      "Explain bounded contexts across the platform",
    ],
    bestFor: "Domain modelling and integration planning.",
  },
  {
    id: "ai-observability-loop",
    title: "AI Observability Feedback Loop",
    description:
      "Track how prompts, models, and evaluations work together to improve AI output quality.",
    category: "Sequence",
    complexity: "Intermediate",
    prompt:
      "Illustrate the lifecycle from prompt submission to monitoring, human review, and dataset enrichment for retraining.",
    mermaidCode: `sequenceDiagram
      participant User
      participant PromptAPI
      participant Model as AI Model
      participant Monitor as Observability
      participant Reviewer as Human Reviewer
      participant Trainer as Training Pipeline
      User->>PromptAPI: Submit prompt
      PromptAPI->>Model: Generate diagram
      Model-->>PromptAPI: Mermaid code
      PromptAPI->>Monitor: Emit metrics & traces
      Monitor->>Reviewer: Flag low confidence outputs
      Reviewer-->>Monitor: Review results
      Monitor->>Trainer: Create feedback dataset
      Trainer->>Model: Retrain with feedback
      Model-->>PromptAPI: Updated model version
      PromptAPI-->>User: Return improved diagram`,
    tags: ["ai", "observability", "feedback"],
    recommendedPrompts: [
      "Explain our AI evaluation and improvement loop",
      "Show how human feedback enhances AI diagrams",
    ],
    bestFor: "Responsible AI documentation and roadmap planning.",
  },
  {
    id: "incident-response-timeline",
    title: "Incident Response Timeline",
    description:
      "Communicate key events and owners during a production incident.",
    category: "Gantt",
    complexity: "Beginner",
    prompt:
      "Lay out an incident timeline covering detection, triage, mitigation, communication, and postmortem actions.",
    mermaidCode: `gantt
      title Incident Response Timeline
      dateFormat  HH:mm
      axisFormat  %H:%M
      section Detection
      Alert Triggered           :done,    10:00, 10:05
      On-call Paged             :active,  10:05, 10:15
      section Mitigation
      Traffic Routed to Backup  :        10:15, 10:35
      Patch Deployed            :        10:35, 11:05
      section Communication
      Status Page Updated       :        10:20, 10:25
      Exec Briefing             :        10:30, 10:40
      section Follow-up
      Postmortem Draft          :        11:10, 12:00
      Action Items Assigned     :        12:00, 12:30`,
    tags: ["operations", "incident", "timeline"],
    recommendedPrompts: [
      "Outline the steps we took during incident 123",
      "Share the timeline for our Sev-1 response",
    ],
    bestFor: "Post-incident reviews and stakeholder updates.",
  },
  {
    id: "product-experiment-funnel",
    title: "Product Experiment Funnel",
    description:
      "Visualise experiment cohorts and conversions through activation stages.",
    category: "Flowchart",
    complexity: "Beginner",
    prompt:
      "Show experiment variants with user counts and conversion flow through activation, adoption, and retention stages.",
    mermaidCode: `graph TD
      Start[Total Visitors]
      Start --> VariantA[Variant A - 50%]
      Start --> VariantB[Variant B - 50%]
      VariantA --> SignupA[Sign-ups 35%]
      VariantB --> SignupB[Sign-ups 42%]
      SignupA --> ActivationA[Activated 20%]
      SignupB --> ActivationB[Activated 28%]
      ActivationA --> RetentionA[Retained 12%]
      ActivationB --> RetentionB[Retained 18%]`,
    tags: ["growth", "analytics", "experiment"],
    recommendedPrompts: [
      "Summarise our onboarding experiment results",
      "Show conversion by experiment variant",
    ],
    bestFor: "Growth reviews and product analytics discussions.",
  },
  {
    id: "event-streaming-architecture",
    title: "Event Streaming Platform",
    description:
      "Document how producers, brokers, and consumers exchange events across the platform.",
    category: "Flowchart",
    complexity: "Intermediate",
    prompt:
      "Lay out an event streaming architecture including producers, a Kafka cluster, schema registry, and multiple consumer workloads.",
    mermaidCode: `graph LR
      subgraph Producers
        WebApp[Web App]
        MobileApp[Mobile App]
        BatchJob[Batch Ingestion]
      end
      subgraph KafkaCluster["Kafka Cluster"]
        Broker1[Broker 1]
        Broker2[Broker 2]
        SchemaRegistry[(Schema Registry)]
      end
      subgraph Consumers
        ETL[ETL Pipeline]
        Realtime[Realtime Service]
        FeatureStore[Feature Store]
      end
      WebApp -->|Events| Broker1
      MobileApp -->|Events| Broker1
      BatchJob -->|Bulk loads| Broker2
      Broker1 --> SchemaRegistry
      Broker2 --> SchemaRegistry
      Broker1 --> ETL
      Broker1 --> Realtime
      Broker2 --> FeatureStore
      ETL --> Warehouse[(Analytics Warehouse)]
      Realtime --> Cache[(Redis Cache)]
      FeatureStore --> Models[(ML Models)]`,
    tags: ["streaming", "kafka", "data"],
    recommendedPrompts: [
      "Explain our event-driven architecture",
      "Show how producers and consumers connect to Kafka",
    ],
    bestFor: "Data platform overviews and onboarding decks.",
  },
  {
    id: "ml-experiment-tracking",
    title: "ML Experiment Tracking Model",
    description:
      "Capture how experiments, runs, metrics, and artifacts relate in the ML platform.",
    category: "Class",
    complexity: "Advanced",
    prompt:
      "Model the domain objects involved in tracking machine learning experiments, including runs, metrics, parameters, and artifacts.",
    mermaidCode: `classDiagram
    class Experiment {
      +string id
      +string name
      +string objective
      +Date createdAt
    }
    class Run {
      +string id
      +string status
      +Date startedAt
      +Date completedAt
    }
    class Metric {
      +string name
      +float value
      +string step
    }
    class Parameter {
      +string name
      +string value
    }
    class Artifact {
      +string type
      +string uri
    }
    Experiment "1" --> "*" Run : includes
    Run "1" --> "*" Metric : logs
    Run "1" --> "*" Parameter : captures
    Run "1" --> "*" Artifact : outputs
    note for Run "completedAt optional"`,
    tags: ["ml", "experimentation", "tracking"],
    recommendedPrompts: [
      "Document the schema for our ML tracking system",
      "Show how experiment runs capture metrics and artifacts",
    ],
    bestFor: "Platform design docs and ML team onboarding.",
  },
  {
    id: "support-escalation-state",
    title: "Support Escalation States",
    description:
      "Clarify how tickets progress from intake through engineering escalation and resolution.",
    category: "State",
    complexity: "Beginner",
    prompt:
      "Map the state transitions for a customer support ticket including escalation and monitoring steps.",
    mermaidCode: `stateDiagram-v2
    [*] --> Triage
    Triage --> Resolving: Owner assigned
    Resolving --> Waiting: Need info
    Waiting --> Resolving: Customer replied
    Resolving --> Escalated: SLA risk
    Escalated --> Engineering: Hand off to engineering
    Engineering --> Monitoring: Fix deployed
    Monitoring --> Closed: Validated fix
    Closed --> [*]`,
    tags: ["support", "process", "operations"],
    recommendedPrompts: [
      "Outline the ticket escalation process",
      "Show how support engages engineering during incidents",
    ],
    bestFor: "Runbooks, training, and vendor documentation.",
  },
  {
    id: "feature-flag-rollout",
    title: "Feature Flag Rollout Timeline",
    description:
      "Communicate the plan for progressively enabling a new capability via feature flags.",
    category: "Timeline",
    complexity: "Beginner",
    prompt:
      "Create a rollout timeline that shows preparation tasks, ramp schedule, and follow-up analysis for a feature flag launch.",
    mermaidCode: `timeline
      title Feature Flag Rollout
      section Preparation
        Define success metrics : Product
        Implement guardrails : Engineering
        Backfill cohorts : Data
      section Launch
        Enable internal users : Day 1
        Ramp to 25% of traffic : Day 2
        Ramp to 50% of traffic : Day 3
        Ramp to 100% of traffic : Day 5
      section Follow-up
        Monitor KPIs & alerts : Day 5-7
        Run experiment review : Day 7
        Clean up flag & code paths : Day 10`,
    tags: ["release", "feature-flags", "planning"],
    recommendedPrompts: [
      "Share the rollout plan for our next feature",
      "Align teams on the ramp schedule and responsibilities",
    ],
    bestFor: "Release kick-offs and stakeholder updates.",
  },
  {
    id: "data-quality-observability",
    title: "Data Quality Observability Loop",
    description:
      "Show how data tests, alerts, and remediation close the loop on pipeline health.",
    category: "Flowchart",
    complexity: "Intermediate",
    prompt:
      "Diagram the end-to-end flow for detecting, triaging, and resolving data quality regressions in analytics pipelines.",
    mermaidCode: `graph TD
      Source[Source Systems] --> Pipelines[ETL Pipelines]
      Pipelines --> Warehouse[(Analytics Warehouse)]
      Warehouse --> Tests[Data Quality Tests]
      Tests -->|Pass| Dashboards[BI Dashboards]
      Tests -->|Fail| Alerts[Pager Alerts]
      Alerts --> OnCall[Data On-call]
      OnCall --> Runbook[Review Runbooks]
      Runbook --> Fix[Deploy Fix]
      Fix --> Pipelines
      OnCall --> IncidentDoc[Incident Doc]
      IncidentDoc --> Backlog[Backlog Work Items]
      Backlog --> Pipelines`,
    tags: ["data", "observability", "quality"],
    recommendedPrompts: [
      "Explain our data quality response flow",
      "Show how failed tests trigger incident management",
    ],
    bestFor: "Analytics governance and operational readiness docs.",
  },
];

export default function TemplatesPage() {
  const { data: apiTemplates, error } = useSWR<ChartTemplate[]>(
    "/api/charts/templates",
    (url: string) => api.get(url).then((res) => res.data),
  );
  const { user } = useUser();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [complexity, setComplexity] = useState<"All" | ChartTemplate["complexity"]>(
    "All",
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChartTemplate | null>(
    null,
  );
  const [customTitle, setCustomTitle] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);

  const templates = apiTemplates ?? (error ? fallbackTemplates : undefined);
  const usingFallback = Boolean(error && !apiTemplates);

  const categories = useMemo(() => {
    if (!templates) return [] as string[];
    return Array.from(new Set(templates.map((item) => item.category))).sort();
  }, [templates]);

  const complexities = useMemo(() => {
    if (!templates) return [] as ChartTemplate["complexity"][];
    return Array.from(new Set(templates.map((item) => item.complexity))).sort(
      (a, b) => complexityOrder[a] - complexityOrder[b],
    );
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (!templates) return [] as ChartTemplate[];

    const keyword = search.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesCategory =
        category === "All" || template.category === category;
      const matchesComplexity =
        complexity === "All" || template.complexity === complexity;
      const matchesKeyword =
        !keyword ||
        template.title.toLowerCase().includes(keyword) ||
        template.description.toLowerCase().includes(keyword) ||
        template.tags.some((tag) => tag.toLowerCase().includes(keyword));

      return matchesCategory && matchesComplexity && matchesKeyword;
    });
  }, [category, complexity, templates, search]);

  const openDialogForTemplate = (template: ChartTemplate) => {
    if (!user) {
      toast.error("Log in to start from templates");
      router.push("/login?next=/templates");
      return;
    }

    setSelectedTemplate(template);
    setCustomTitle(template.title);
    setCustomPrompt(template.prompt);
    setIsPublic(false);
    setDialogOpen(true);
  };

  const createFromTemplate = async () => {
    if (!selectedTemplate) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to create charts");
      return;
    }

    setCreating(true);
    try {
      const { data: created } = await api.post(
        `/api/charts/templates/${selectedTemplate.id}`,
        {
          title: customTitle,
          prompt: customPrompt,
          isPublic,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Template copied to your workspace");
      setDialogOpen(false);
      router.push(`/charts/${created._id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to create chart";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const pageTitle = "Template Library • MermaidGenie";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Jump-start your next Mermaid diagram with curated templates for flowcharts, UML, journeys and more."
        />
      </Head>

      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Library className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold md:text-5xl">
            Template Library
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Skip the blank canvas. Pick a template, customise the prompt, and generate a ready-to-share diagram in seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card/50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search templates, tags, or use-cases"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" /> Advanced filters
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {["All", ...categories].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition",
                    item === category
                      ? "border-primary bg-primary text-primary-foreground shadow"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["All", ...complexities].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition",
                    item === complexity
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                  onClick={() =>
                    setComplexity(item as typeof complexity)
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {usingFallback && (
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-6 text-center text-yellow-700 dark:text-yellow-200">
            We couldn’t reach the API, so you’re viewing the offline template set. Try again later for the live catalogue.
          </div>
        )}

        {!templates && !error && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {templates && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="flex h-full flex-col overflow-hidden border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
                  <Badge>{template.category}</Badge>
                  <Badge className="border-primary/10 bg-transparent text-xs text-muted-foreground">
                    {template.complexity}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <MermaidPreview code={template.mermaidCode} className="min-h-[220px]" />
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">{template.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Best for
                    </p>
                    <p className="text-sm">{template.bestFor}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Try these prompts
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {template.recommendedPrompts.map((promptOption) => (
                        <li key={promptOption}>{promptOption}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-2">
                    <Button
                      className="w-full gap-2"
                      onClick={() => openDialogForTemplate(template)}
                    >
                      <Sparkles className="h-4 w-4" /> Use template
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-full rounded-lg border border-dashed border-border/60 bg-muted/40 p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No templates match your filters. Try clearing the search or selecting a different category.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Copy template</DialogTitle>
            <DialogDescription>
              We’ll create a new chart in your workspace using this template’s Mermaid code. Feel free to tweak the title and prompt before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="template-title" className="text-sm font-medium">
                Chart title
              </label>
              <Input
                id="template-title"
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
                placeholder="e.g. Customer onboarding journey"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="template-prompt" className="text-sm font-medium">
                Prompt (used for future regenerations)
              </label>
              <Textarea
                id="template-prompt"
                rows={4}
                value={customPrompt}
                onChange={(event) => setCustomPrompt(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
              <Switch
                id="template-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <div className="space-y-0.5">
                <label htmlFor="template-public" className="text-sm font-semibold">
                  {isPublic ? "Public chart" : "Private chart"}
                </label>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? "Anyone with the link can view this chart."
                    : "Only you can access this chart until you share it."}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createFromTemplate} disabled={creating} className="gap-2">
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}Copy to charts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
