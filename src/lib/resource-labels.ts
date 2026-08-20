import type { ResourceCategory } from "@/content/types";

const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  aws: "AWS",
  docker: "Docker",
  devops: "DevOps",
  kubernetes: "Kubernetes",
  backend: "Backend Engineering",
  ci_cd: "CI/CD",
  career: "Career",
  engineering: "Engineering",
};

export function resourceCategoryLabel(category: ResourceCategory) {
  return RESOURCE_CATEGORY_LABELS[category];
}
