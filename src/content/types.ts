export type ContentType = "blog" | "insight";

export type ServiceSlug =
  | "cloud-devops"
  | "backend-engineering"
  | "production-readiness-audit"
  | "architecture-consulting";

export type ResourceType = "free_resource" | "paid_product";

export type ResourceCategory =
  | "aws"
  | "docker"
  | "devops"
  | "kubernetes"
  | "backend"
  | "ci_cd"
  | "career"
  | "engineering";

export type ConsultationStatus = "new" | "reviewed" | "responded" | "converted" | "archived";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface Article {
  id?: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  featured?: boolean;
  coverUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export interface ProjectMedia {
  type: "image" | "gif";
  url: string;
  alt: string;
  caption: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id?: string;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  stack: string[];
  capabilities: string[];
  repositories: ProjectLink[];
  liveUrl?: string;
  media?: ProjectMedia[];
  featured?: boolean;
  year: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  location: string;
  period: string;
  current?: boolean;
  details: string[];
}

export interface SkillItem {
  name: string;
  icon: string;
  description: string;
}

export interface SkillGroup {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  capabilities: string[];
  priceLabel?: string;
  displayOrder: number;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
}

export interface Resource {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  externalUrl?: string;
  status: "draft" | "published";
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  organization?: string;
  serviceRequested: string;
  projectDescription: string;
  budgetRange?: string;
  timeline?: string;
  websiteUrl?: string;
  status: ConsultationStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  resourceId: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentReference?: string;
  paymentProvider?: string;
  downloadToken?: string;
  downloadExpiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}
