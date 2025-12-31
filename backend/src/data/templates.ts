export interface ChartTemplate {
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

export const chartTemplates: ChartTemplate[] = [
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
