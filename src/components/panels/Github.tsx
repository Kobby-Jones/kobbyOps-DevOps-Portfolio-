"use client";
import { useEffect, useState } from "react";
import {
  Github,
  Star,
  GitFork,
  Clock,
  Globe,
  Code2,
  Users,
} from "lucide-react";

type Overview = {
  user: {
    login: string;
    name: string | null;
    avatar_url: string;
    followers: number;
    following: number;
    public_repos: number;
  };
  metrics: {
    repoCount: number;
    totalStars: number;
    totalForks: number;
    lastPushISO: string | null;
  };
  repos: Array<{
    id: number;
    name: string;
    description: string | null;
    url: string;
    language: string | null;
    stars: number;
    forks: number;
    pushed_at: string;
    homepage: string | null;
  }>;
};

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-zinc-400 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-semibold text-zinc-100 mt-1">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function GithubPanel() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/overview")
      .then((r) => r.json())
      .then((json: unknown) => {
        if (json && typeof json === "object" && "user" in json) {
          setData(json as Overview);
        } else {
          setData(null);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-zinc-400 text-sm">Loading GitHub data…</div>;

  if (!data || "error" in data)
    return (
      <div className="text-zinc-400 text-sm">
        Failed to load GitHub data. Ensure{" "}
        <code>GITHUB_USERNAME</code> and <code>GITHUB_TOKEN</code> are set.
      </div>
    );

  const { user, metrics, repos } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-zinc-200 font-semibold flex items-center gap-2">
          <Github size={18} className="text-teal-400" />
          GitHub Activity
        </h2>
        <a
          href={`https://github.com/${user.login}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
        >
          <Github size={14} />
          View Profile
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat
          icon={<Code2 size={14} className="text-teal-400" />}
          label="Repositories"
          value={metrics.repoCount}
          sub={`${user.public_repos} public`}
        />
        <Stat
          icon={<Star size={14} className="text-teal-400" />}
          label="Total Stars"
          value={metrics.totalStars}
        />
        <Stat
          icon={<GitFork size={14} className="text-teal-400" />}
          label="Total Forks"
          value={metrics.totalForks}
        />
        <Stat
          icon={<Users size={14} className="text-teal-400" />}
          label="Followers"
          value={user.followers}
          sub={`${user.following} following`}
        />
      </div>

      {/* Repos list */}
      <div>
        <div className="text-zinc-300 mb-2 font-medium">
          Repositories (sorted by last update)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {repos
            .sort(
              (a, b) =>
                new Date(b.pushed_at).getTime() -
                new Date(a.pushed_at).getTime()
            )
            .map((r) => (
              <div
                key={r.id}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 hover:scale-[1.01] transition max-w-full"
              >
                <div className="flex items-center justify-between">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-100 font-semibold hover:underline block truncate"
                    title={r.name}
                  >
                    {r.name}
                  </a>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full text-[11px] font-mono">
                      <Star size={12} className="text-yellow-400" />
                      {r.stars}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-full text-[11px] font-mono">
                      <GitFork size={12} className="text-sky-400" />
                      {r.forks}
                    </span>
                  </div>
                </div>

                {r.description && (
                  <div className="text-sm text-zinc-400 mt-1">
                    {r.description}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(r.pushed_at).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Code2 size={12} />
                    {r.language ?? "N/A"}
                  </span>
                </div>

                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Updated{" "}
                  {new Date(r.pushed_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {r.homepage && (
                  <div className="mt-2 text-right">
                    <a
                      href={r.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-300 text-xs hover:underline flex items-center gap-1 justify-end"
                    >
                      <Globe size={12} />
                      Live
                    </a>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
