import type { ContentType, ResourceCategory, ResourceType } from "@/content/types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function cleanText(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseContentPayload(input: Record<string, unknown>) {
  const type = cleanText(input.type, 20) as ContentType;
  const title = cleanText(input.title, 160);
  const slug = slugify(cleanText(input.slug, 100) || title);
  const excerpt = cleanText(input.excerpt, 320);
  const content = cleanText(input.content, 50000);
  const status = cleanText(input.status, 20) === "published" ? "published" : "draft";

  if (!(["blog", "insight"] as string[]).includes(type)) {
    throw new Error("Content type must be blog or insight.");
  }
  if (!title || !slug || !excerpt || !content) {
    throw new Error("Title, slug, excerpt, and content are required.");
  }

  const rawTags = Array.isArray(input.tags)
    ? input.tags
    : cleanText(input.tags, 500).split(",");

  return {
    id: cleanText(input.id, 80) || undefined,
    type,
    title,
    slug,
    excerpt,
    content,
    status,
    tags: rawTags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 12),
    cover_url: cleanText(input.coverUrl, 1000) || null,
    seo_title: cleanText(input.seoTitle, 180) || null,
    seo_description: cleanText(input.seoDescription, 320) || null,
    canonical_url: cleanText(input.canonicalUrl, 1000) || null,
    reading_minutes: Math.max(1, Math.min(60, Number(input.readingMinutes) || 5)),
    featured: Boolean(input.featured),
    published_at:
      cleanText(input.publishedAt, 40) ||
      (status === "published" ? new Date().toISOString() : new Date().toISOString()),
  };
}

const RESOURCE_TYPES: ResourceType[] = ["free_resource", "paid_product"];
const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "aws", "docker", "devops", "kubernetes", "backend", "ci_cd", "career", "engineering",
];

export function parseServicePayload(input: Record<string, unknown>) {
  const title = cleanText(input.title, 160);
  const slug = slugify(cleanText(input.slug, 100) || title);
  const shortDescription = cleanText(input.shortDescription, 320);
  const description = cleanText(input.description, 10000);
  const status = cleanText(input.status, 20) === "published" ? "published" : "draft";

  if (!title || !slug || !shortDescription || !description) {
    throw new Error("Title, slug, short description, and description are required.");
  }

  const rawCaps = Array.isArray(input.capabilities)
    ? input.capabilities
    : cleanText(input.capabilities, 5000).split("\n");

  return {
    id: cleanText(input.id, 80) || undefined,
    title,
    slug,
    short_description: shortDescription,
    description,
    icon: cleanText(input.icon, 40) || null,
    capabilities: rawCaps.map((c: unknown) => cleanText(c, 200)).filter(Boolean).slice(0, 20),
    price_label: cleanText(input.priceLabel, 100) || null,
    display_order: Math.max(0, Number(input.displayOrder) || 0),
    status,
    seo_title: cleanText(input.seoTitle, 180) || null,
    seo_description: cleanText(input.seoDescription, 320) || null,
  };
}

export function parseResourcePayload(input: Record<string, unknown>) {
  const title = cleanText(input.title, 160);
  const slug = slugify(cleanText(input.slug, 100) || title);
  const shortDescription = cleanText(input.shortDescription, 320);
  const description = cleanText(input.description, 20000);
  const rawType = cleanText(input.type, 30) as ResourceType;
  const rawCategory = cleanText(input.category, 30) as ResourceCategory;
  const status = cleanText(input.status, 20) === "published" ? "published" : "draft";

  if (!title || !slug || !shortDescription || !description) {
    throw new Error("Title, slug, short description, and description are required.");
  }
  if (!RESOURCE_TYPES.includes(rawType)) {
    throw new Error("Type must be free_resource or paid_product.");
  }

  return {
    id: cleanText(input.id, 80) || undefined,
    title,
    slug,
    short_description: shortDescription,
    description,
    type: rawType,
    category: RESOURCE_CATEGORIES.includes(rawCategory) ? rawCategory : "engineering",
    price: Math.max(0, Number(input.price) || 0),
    currency: cleanText(input.currency, 10) || "USD",
    thumbnail_url: cleanText(input.thumbnailUrl, 1000) || null,
    file_url: cleanText(input.fileUrl, 1000) || null,
    external_url: cleanText(input.externalUrl, 1000) || null,
    status,
    featured: Boolean(input.featured),
    seo_title: cleanText(input.seoTitle, 180) || null,
    seo_description: cleanText(input.seoDescription, 320) || null,
  };
}

export function parseConsultationPayload(input: Record<string, unknown>) {
  const name = cleanText(input.name, 100);
  const email = cleanText(input.email, 200).toLowerCase();
  const organization = cleanText(input.organization, 200);
  const serviceRequested = cleanText(input.serviceRequested, 100);
  const projectDescription = cleanText(input.projectDescription, 5000);
  const budgetRange = cleanText(input.budgetRange, 100);
  const timeline = cleanText(input.timeline, 100);
  const websiteUrl = cleanText(input.websiteUrl, 500);

  if (!name || !serviceRequested || !projectDescription) {
    throw new Error("Name, service, and project description are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  return {
    name,
    email,
    organization: organization || null,
    service_requested: serviceRequested,
    project_description: projectDescription,
    budget_range: budgetRange || null,
    timeline: timeline || null,
    website_url: websiteUrl || null,
  };
}


export function parseCheckoutPayload(input: Record<string, unknown>) {
  const resourceId = cleanText(input.resourceId, 80);
  const customerName = cleanText(input.customerName, 120);
  const customerEmail = cleanText(input.customerEmail, 200).toLowerCase();

  if (!resourceId || !/^[0-9a-f-]{36}$/i.test(resourceId)) {
    throw new Error("A valid resource is required.");
  }
  if (!customerName) {
    throw new Error("Your name is required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new Error("Please provide a valid email address.");
  }

  return { resourceId, customerName, customerEmail };
}
