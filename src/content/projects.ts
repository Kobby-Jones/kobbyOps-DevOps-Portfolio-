import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "ai-public-service-workflow-engine",
    title: "AI-Enabled Public Service Workflow Engine",
    eyebrow: "Cloud platform · Applied AI",
    summary:
      "A transparent request-management platform for Ghanaian municipalities, combining citizen reporting, role-based staff workflows, SLA automation, explainable routing, audit trails, and production deployment controls.",
    challenge:
      "Municipal service requests can become difficult to trace when intake, routing, escalation, and inter-department hand-offs rely on fragmented manual processes.",
    solution:
      "I designed a containerised FastAPI and Flutter platform with PostgreSQL, Redis, Celery, role-based access, status-transition rules, confidence-aware ML routing, notifications, analytics, and a complete audit trail.",
    outcome:
      "The project provides one accountable workflow from citizen submission to departmental resolution, with explainable automation and operational controls designed for real institutional use.",
    stack: ["FastAPI", "Flutter", "PostgreSQL", "Redis", "Celery", "Docker", "NGINX", "GitHub Actions"],
    capabilities: [
      "Explainable request classification and priority support",
      "SLA deadlines, escalations, notifications, and audit history",
      "Citizen mobile experience and department-scoped staff workflows",
      "Containerised production topology with CI validation",
    ],
    repositories: [
      {
        label: "Source repository",
        url: "https://github.com/Kobby-Jones/Request_Management",
      },
    ],
    featured: true,
    year: "2026",
    seoTitle: "AI Public Service Workflow Platform",
    seoDescription:
      "Explore Cobbina Emmanuel's AI-enabled municipal request-management platform built with FastAPI, Flutter, PostgreSQL, Redis, Docker, and explainable routing.",
  },
  {
    slug: "offline-first-itsm-platform",
    title: "Offline-First IT Service Management Platform",
    eyebrow: "Platform engineering · Full stack",
    summary:
      "A multi-platform ITSM system for Ghanaian organisations that keeps essential ticket workflows available during unreliable connectivity and synchronises work when service returns.",
    challenge:
      "A service desk cannot be dependable if technicians lose the ability to create, update, or discuss tickets whenever a field device goes offline.",
    solution:
      "The Flutter client uses Riverpod, Dio, Hive, secure storage, and a persistent offline write queue. It connects to an Express and PostgreSQL backend with JWT/RBAC, Redis, BullMQ workers, SLA checks, notifications, and OpenAPI documentation.",
    outcome:
      "One responsive codebase supports mobile, desktop, and web workflows while keeping network and caching concerns out of the user-interface layer.",
    stack: ["Flutter", "Riverpod", "Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Docker"],
    capabilities: [
      "Offline write queue with automatic synchronisation",
      "Role-specific experiences for users, technicians, managers, and administrators",
      "SLA monitoring, notifications, knowledge base, and asset workflows",
      "Cross-platform delivery from a shared Flutter codebase",
    ],
    repositories: [
      { label: "Flutter client", url: "https://github.com/Kobby-Jones/ITSM" },
      { label: "Backend API", url: "https://github.com/Kobby-Jones/ITSM_Backend" },
    ],
    featured: true,
    year: "2026",
  },
  {
    slug: "ml-data-loss-prevention",
    title: "ML-Based Data Loss Prevention System",
    eyebrow: "Security engineering · Machine learning",
    summary:
      "A privacy-conscious DLP platform for small accounting firms that classifies document sensitivity, evaluates user behaviour, and applies an explainable policy response.",
    challenge:
      "Smaller organisations need practical protection for sensitive financial documents without sending the raw contents of every file to a central service.",
    solution:
      "The architecture separates endpoint scanning, document classification, behaviour analytics, policy evaluation, alerts, incidents, reporting, and model management. The central service stores event metadata and risk signals, not raw client documents.",
    outcome:
      "The two-stage decision model supports proportionate allow, log, warn, alert, or block actions while making privacy a system boundary rather than an afterthought.",
    stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "scikit-learn", "Docker", "NGINX"],
    capabilities: [
      "Document sensitivity classification",
      "User-behaviour anomaly detection",
      "Policy engine, incident management, and audit reporting",
      "Privacy-by-design event architecture",
    ],
    repositories: [
      { label: "Source repository", url: "https://github.com/Kobby-Jones/DLP_System" },
    ],
    featured: true,
    year: "2026",
  },
  {
    slug: "kubernetes-gitops-react-deployment",
    title: "Kubernetes GitOps Delivery with Argo CD",
    eyebrow: "DevOps · GitOps",
    summary:
      "A reproducible delivery path for a containerised React application using NGINX, Kubernetes manifests, and Argo CD reconciliation.",
    challenge:
      "Application delivery becomes fragile when cluster state depends on manual commands that are not reviewed, repeatable, or continuously reconciled.",
    solution:
      "The application is packaged as an NGINX-served container, deployed through Kubernetes resources, and connected to Argo CD so the declared Git state remains the deployment source of truth.",
    outcome:
      "The repository documents the complete path from local build to visible Argo CD resource state and provides visual evidence of the delivery flow.",
    stack: ["React", "Docker", "NGINX", "Kubernetes", "Argo CD", "GitHub"],
    capabilities: [
      "Container build and production web serving",
      "Declarative Kubernetes deployment and service resources",
      "GitOps reconciliation through Argo CD",
      "Architecture and deployment evidence gallery",
    ],
    repositories: [
      {
        label: "Source repository",
        url: "https://github.com/Kobby-Jones/react-deployment-with-k8s-ArgoCD",
      },
    ],
    media: [
      {
        type: "image",
        url: "https://raw.githubusercontent.com/Kobby-Jones/react-deployment-with-k8s-ArgoCD/main/screenshorts/argocd-flow.png",
        alt: "Argo CD delivery flow for the React Kubernetes project",
        caption: "GitOps delivery flow from repository to the Kubernetes workload.",
      },
      {
        type: "image",
        url: "https://raw.githubusercontent.com/Kobby-Jones/react-deployment-with-k8s-ArgoCD/main/screenshorts/argocd-ui-tree.png",
        alt: "Argo CD application resource tree",
        caption: "Argo CD resource tree showing the reconciled application state.",
      },
    ],
    featured: true,
    year: "2025",
  },
  {
    slug: "docker-compose-three-tier-application",
    title: "Three-Tier Application with Docker Compose",
    eyebrow: "Containers · Application architecture",
    summary:
      "A containerised three-tier system joining a React frontend, Node.js API, and MySQL database through a repeatable Docker Compose environment.",
    challenge:
      "A multi-service application needs predictable networking, startup, configuration, and data persistence across development machines.",
    solution:
      "Each tier is packaged independently and composed as one environment, with service networking and persistent database volumes captured in version-controlled configuration.",
    outcome:
      "The project demonstrates a portable local topology and includes an animated infrastructure flow that can be reviewed directly from the case study.",
    stack: ["React", "Node.js", "MySQL", "Docker", "Docker Compose"],
    capabilities: [
      "Independent frontend, API, and database services",
      "Repeatable service networking and configuration",
      "Persistent MySQL data volumes",
      "Animated architecture walkthrough",
    ],
    repositories: [
      {
        label: "Source repository",
        url: "https://github.com/Kobby-Jones/Three-Tier-Applications",
      },
    ],
    media: [
      {
        type: "gif",
        url: "https://raw.githubusercontent.com/Kobby-Jones/Three-Tier-Applications/main/assets/Infra.gif",
        alt: "Animated infrastructure flow for the three-tier Docker application",
        caption: "Animated data flow across the frontend, backend, and database tiers.",
      },
    ],
    year: "2025",
  },
  {
    slug: "idempotency-payment-gateway",
    title: "Idempotency Gateway for Safe Payment Retries",
    eyebrow: "Backend engineering · Reliability",
    summary:
      "A FastAPI gateway that prevents duplicate payment processing by binding each request body to an idempotency key and replaying completed responses safely.",
    challenge:
      "Network retries are normal, but a repeated payment request must never become a second charge.",
    solution:
      "The gateway hashes request bodies, tracks processing and completed states, coordinates concurrent requests, detects key conflicts, replays safe responses, and expires stale records with a TTL.",
    outcome:
      "The implementation turns retry safety into an explicit protocol with clear 201, replay, in-flight, and 409 conflict behaviour.",
    stack: ["Python", "FastAPI", "Concurrency", "REST API", "Idempotency"],
    capabilities: [
      "Request-body hashing and key conflict detection",
      "Thread-safe in-flight request coordination",
      "Completed response replay with cache signalling",
      "TTL-based record expiration",
    ],
    repositories: [
      {
        label: "Source repository",
        url: "https://github.com/Kobby-Jones/Idempotency-Gateway",
      },
    ],
    year: "2026",
  },
];
