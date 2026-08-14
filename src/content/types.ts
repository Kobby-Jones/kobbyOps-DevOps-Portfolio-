export type ContentType = "blog" | "insight";

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
