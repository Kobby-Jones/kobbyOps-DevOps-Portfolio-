import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";
import {
  SiArgo,
  SiDocker,
  SiFlutter,
  SiGit,
  SiGithubactions,
  SiJenkins,
  SiKubernetes,
  SiLinux,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTypescript,
} from "react-icons/si";
import { Activity, Braces, GitBranch, PenTool, ShieldCheck, Workflow } from "lucide-react";
import { skillGroups } from "@/content/profile";

const brandIcons: Record<string, IconType> = {
  aws: FaAws,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  "github-actions": SiGithubactions,
  argocd: SiArgo,
  jenkins: SiJenkins,
  linux: SiLinux,
  nginx: SiNginx,
  python: SiPython,
  typescript: SiTypescript,
  node: SiNodedotjs,
  react: SiReact,
  next: SiNextdotjs,
  flutter: SiFlutter,
  postgresql: SiPostgresql,
  redis: SiRedis,
  git: SiGit,
};

const practiceIcons = {
  api: Braces,
  cicd: GitBranch,
  security: ShieldCheck,
  observability: Activity,
  writing: PenTool,
  default: Workflow,
};

export default function SkillGrid() {
  return (
    <div className="space-y-12">
      {skillGroups.map((group) => (
        <section key={group.category} aria-labelledby={`skill-${group.category.replaceAll(" ", "-")}`}>
          <div className="mb-6 max-w-2xl">
            <h3 id={`skill-${group.category.replaceAll(" ", "-")}`} className="text-xl font-semibold text-white">
              {group.category}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{group.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {group.skills.map((skill) => {
              const BrandIcon = brandIcons[skill.icon];
              const PracticeIcon = practiceIcons[skill.icon as keyof typeof practiceIcons] || practiceIcons.default;
              const Icon = BrandIcon || PracticeIcon;
              return (
                <div className="skill-card" key={skill.name}>
                  <span className="skill-icon"><Icon size={23} aria-hidden="true" /></span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{skill.name}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{skill.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
