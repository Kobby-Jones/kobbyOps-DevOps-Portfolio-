import type { ExperienceItem, SkillGroup } from "./types";

export const experience: ExperienceItem[] = [
  {
    role: "Senior ICT Assistant",
    organization: "University of Energy and Natural Resources (UENR)",
    location: "Ghana",
    period: "April 2026 - Present",
    current: true,
    details: [
      "Analyse staff data and prepare monthly, quarterly, and institutional reports for decision-making.",
      "Respond to cross-department data requests with accurate, timely retrieval and presentation.",
      "Support institutional systems, applications, and day-to-day technology operations.",
    ],
  },
  {
    role: "Software Developer",
    organization: "Freelance & Contract",
    location: "Remote",
    period: "January 2024 - Present",
    current: true,
    details: [
      "Build backend APIs and integrations for web and mobile products.",
      "Deliver full-stack systems with Python, Django, Node.js, and PostgreSQL.",
      "Integrate third-party services and AI capabilities into production-oriented applications.",
    ],
  },
  {
    role: "Teaching & Research Assistant",
    organization: "University of Energy and Natural Resources (UENR)",
    location: "Sunyani, Ghana",
    period: "October 2024 - September 2025",
    details: [
      "Supported teaching in software engineering, databases, and core computer science subjects.",
      "Contributed to research, technical writing, and structured learning materials.",
    ],
  },
  {
    role: "Cloud Engineering Intern",
    organization: "AmaliTech, AWS re/Start",
    location: "Remote",
    period: "September 2024 - January 2025",
    details: [
      "Built cloud-native solutions with EC2, S3, Lambda, API Gateway, RDS, and Step Functions.",
      "Implemented delivery workflows with Docker, Jenkins, and GitHub Actions.",
      "Designed serverless architectures for scalable and cost-conscious workloads.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Cloud & platform",
    description: "Infrastructure, containers, delivery automation, and production operations.",
    skills: [
      { name: "AWS", icon: "aws", description: "EC2, S3, Lambda, RDS, API Gateway, DynamoDB, Rekognition" },
      { name: "Docker", icon: "docker", description: "Images, Compose, multi-stage builds, runtime hardening" },
      { name: "Kubernetes", icon: "kubernetes", description: "Workloads, services, configuration, rollout operations" },
      { name: "GitHub Actions", icon: "github-actions", description: "Automated test, build, security, and deployment workflows" },
      { name: "Argo CD", icon: "argocd", description: "Declarative delivery and GitOps reconciliation" },
      { name: "Jenkins", icon: "jenkins", description: "Pipeline automation and delivery orchestration" },
      { name: "Linux", icon: "linux", description: "Server administration, shell workflows, and diagnostics" },
      { name: "NGINX", icon: "nginx", description: "Reverse proxying, TLS termination, and static serving" },
    ],
  },
  {
    category: "Software engineering",
    description: "Backend, frontend, mobile, API, and data-layer development.",
    skills: [
      { name: "Python", icon: "python", description: "FastAPI, Django, automation, and data workloads" },
      { name: "TypeScript", icon: "typescript", description: "Typed application and API development" },
      { name: "Node.js", icon: "node", description: "Express services, integrations, workers, and tooling" },
      { name: "React", icon: "react", description: "Accessible, responsive web interfaces" },
      { name: "Next.js", icon: "next", description: "Server-rendered applications and technical SEO" },
      { name: "Flutter", icon: "flutter", description: "Cross-platform mobile, desktop, and web applications" },
      { name: "PostgreSQL", icon: "postgresql", description: "Relational modelling, queries, and performance" },
      { name: "Redis", icon: "redis", description: "Caching, queues, and coordination" },
    ],
  },
  {
    category: "Engineering practices",
    description: "The methods used to move from working code to dependable systems.",
    skills: [
      { name: "Git", icon: "git", description: "Reviewable changes, branching, and release history" },
      { name: "REST APIs", icon: "api", description: "Resource design, contracts, authentication, and idempotency" },
      { name: "CI/CD", icon: "cicd", description: "Repeatable validation and controlled delivery" },
      { name: "Security", icon: "security", description: "RBAC, secrets, audit trails, and secure defaults" },
      { name: "Observability", icon: "observability", description: "Logs, metrics, health signals, and actionable diagnostics" },
      { name: "Technical writing", icon: "writing", description: "Architecture records, runbooks, research, and developer guides" },
    ],
  },
];

export const certifications = [
  {
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    year: "2026",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2025",
  },
];
