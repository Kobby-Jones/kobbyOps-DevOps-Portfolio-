import { NextResponse } from "next/server";

const GH = "https://api.github.com";
const GH_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
};

type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  homepage: string | null;
  archived?: boolean;
  fork?: boolean;
};

async function ghFetch<T>(path: string, revalidate = 1800): Promise<T> {
  const res = await fetch(`${GH}${path}`, {
    headers: {
      ...GH_HEADERS,
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status}: ${text}`);
  }
  return res.json();
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  if (!username) {
    return NextResponse.json({ error: "GITHUB_USERNAME is not set" }, { status: 500 });
  }

  try {
    const [user, reposRaw] = await Promise.all([
      ghFetch<GhUser>(`/users/${username}`),
      ghFetch<Repo[]>(`/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    // Filter out forks/archived by default (cleaner portfolio)
    const repos = reposRaw.filter((r) => !r.fork && !r.archived);

    const repoCount = repos.length;
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const lastPushedMs = repos.reduce(
      (max, r) => Math.max(max, new Date(r.pushed_at).getTime()),
      0
    );

    const minimalRepos = repos.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushed_at: r.pushed_at,
      homepage: r.homepage,
    }));

    return NextResponse.json({
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
      },
      metrics: {
        repoCount,
        totalStars,
        totalForks,
        lastPushISO: lastPushedMs ? new Date(lastPushedMs).toISOString() : null,
      },
      repos: minimalRepos,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
