import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps Engineering",
    shortDescription:
      "Deploy and operate reliable software infrastructure on AWS and modern cloud platforms.",
    description: `I help teams move applications from development into reliable, secure, and maintainable production environments.

Whether you are launching a new product, migrating infrastructure, or improving deployment confidence, I work with your team to design and implement cloud infrastructure that supports the way you build and ship software.

This service covers the full operational surface — from initial architecture through deployment automation, monitoring, and ongoing operational improvements.`,
    icon: "cloud",
    capabilities: [
      "AWS infrastructure design and implementation",
      "Docker containerisation and orchestration",
      "CI/CD pipeline design with GitHub Actions",
      "Linux server administration and hardening",
      "NGINX configuration, TLS, and reverse proxying",
      "PostgreSQL and Redis deployment and operations",
      "Monitoring, logging, and alerting setup",
      "Backup strategies and disaster recovery planning",
      "Infrastructure-as-code and configuration management",
      "Cost analysis and optimisation recommendations",
    ],
    priceLabel: "Starting from $500",
    displayOrder: 1,
    status: "published",
    seoTitle: "Cloud & DevOps Engineering Services",
    seoDescription:
      "Professional cloud and DevOps engineering services — AWS, Docker, CI/CD, Kubernetes, and production infrastructure from an experienced cloud engineer in Ghana.",
  },
  {
    slug: "backend-engineering",
    title: "Backend Engineering",
    shortDescription:
      "Build robust backend systems that provide the APIs, data layer, and business logic behind modern applications.",
    description: `I build the server-side systems that power web and mobile products — APIs, data models, authentication, background processing, integrations, and the operational logic that keeps everything working together.

Good backend engineering is not just about making endpoints respond. It is about designing systems that handle real traffic, fail gracefully, and remain understandable as the product grows.

I work with teams at the stage where they need reliable backend architecture — whether that is building from scratch, refactoring an existing codebase, or extending a system with new capabilities.`,
    icon: "code",
    capabilities: [
      "REST API design, implementation, and documentation",
      "FastAPI and Node.js/Express backend development",
      "PostgreSQL database design and query optimisation",
      "Redis caching, queues, and session management",
      "Authentication and authorisation systems",
      "Background job processing and workflow automation",
      "Third-party service integration",
      "API security, rate limiting, and input validation",
      "Database migrations and schema evolution",
      "Performance profiling and optimisation",
    ],
    priceLabel: "Starting from $400",
    displayOrder: 2,
    status: "published",
    seoTitle: "Backend Engineering Services",
    seoDescription:
      "Professional backend engineering — APIs, databases, authentication, and server-side systems built with FastAPI, Node.js, PostgreSQL, and Redis.",
  },
  {
    slug: "production-readiness-audit",
    title: "Production Readiness Audit",
    shortDescription:
      "Before your application goes into production, I review the system for reliability, security, deployment, and operational risks.",
    description: `A production readiness audit examines your application and infrastructure for risks that are easier to address before they become incidents.

I review architecture, security posture, deployment pipeline, database operations, backup strategy, observability, and scalability considerations. The deliverable is a structured assessment with identified risks, specific recommendations, and a prioritised action plan.

This is not a compliance checkbox exercise. It is an engineering review focused on the practical risks that affect whether your system will hold up under real use.`,
    icon: "shield",
    capabilities: [
      "Architecture and system design review",
      "Security posture assessment",
      "Deployment pipeline and CI/CD evaluation",
      "Database design, indexing, and backup review",
      "Infrastructure configuration audit",
      "Observability and monitoring assessment",
      "Scalability and performance considerations",
      "Cloud cost and resource analysis",
      "Prioritised risk report with actionable recommendations",
      "Follow-up consultation on implementation",
    ],
    priceLabel: "Starting from $150",
    displayOrder: 3,
    status: "published",
    seoTitle: "Production Readiness Audit",
    seoDescription:
      "Production readiness audit service — comprehensive review of architecture, security, deployment, infrastructure, and operational risks before your application goes live.",
  },
  {
    slug: "architecture-consulting",
    title: "Architecture Consulting",
    shortDescription:
      "Evaluate existing or proposed architectures for reliability, scalability, and operational soundness.",
    description: `Architecture decisions made early in a project shape the cost of every change that follows. I help teams evaluate their current architecture or plan a new one with a focus on practical tradeoffs rather than theoretical ideals.

This service is useful when you are starting a new system, considering a significant refactor, migrating to a different infrastructure model, or trying to understand why your current architecture is creating friction.

I provide concrete, documented recommendations — not abstract diagrams that do not connect to your actual constraints.`,
    icon: "layers",
    capabilities: [
      "Backend and API architecture evaluation",
      "Cloud architecture design and review",
      "Database architecture and data modelling",
      "Deployment and infrastructure architecture",
      "Container and orchestration strategy",
      "CI/CD and delivery pipeline design",
      "Scalability and reliability planning",
      "Technology selection and tradeoff analysis",
      "Architecture decision records and documentation",
      "Migration planning and risk assessment",
    ],
    priceLabel: "Request a consultation",
    displayOrder: 4,
    status: "published",
    seoTitle: "Architecture Consulting Services",
    seoDescription:
      "Architecture consulting — evaluate backend, cloud, database, and deployment architectures for reliability, scalability, and maintainability.",
  },
];
