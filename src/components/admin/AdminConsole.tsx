"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Edit3,
  Eye,
  FileText,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";

type ContentItem = {
  id: string;
  type: "blog" | "insight";
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  tags: string[];
  cover_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  reading_minutes: number;
  featured: boolean;
  published_at: string;
  updated_at: string;
};

type Analytics = {
  totalViews: number;
  uniqueVisitors: number;
  viewsLast30Days: number;
  messages: number;
  published: number;
  drafts: number;
  topPages: { path: string; views: number }[];
  daily: { date: string; views: number }[];
  recentMessages: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
  }[];
};

const emptyAnalytics: Analytics = {
  totalViews: 0,
  uniqueVisitors: 0,
  viewsLast30Days: 0,
  messages: 0,
  published: 0,
  drafts: 0,
  topPages: [],
  daily: [],
  recentMessages: [],
};

const initialForm = {
  id: "",
  type: "blog" as "blog" | "insight",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: "",
  status: "draft" as "draft" | "published",
  coverUrl: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  readingMinutes: "5",
  featured: false,
  publishedAt: new Date().toISOString().slice(0, 16),
};

export default function AdminConsole() {
  const [tab, setTab] = useState<"content" | "analytics">("content");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>(emptyAnalytics);
  const [form, setForm] = useState(initialForm);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [contentResponse, analyticsResponse] = await Promise.all([
      fetch("/api/admin/content", { cache: "no-store" }),
      fetch("/api/admin/analytics", { cache: "no-store" }),
    ]);
    if (contentResponse.ok) {
      setItems((await contentResponse.json()).items || []);
    } else {
      const result = await contentResponse.json().catch(() => ({}));
      setNotice(result.error || "Content storage is unavailable.");
    }
    if (analyticsResponse.ok) {
      setAnalytics((await analyticsResponse.json()).analytics || emptyAnalytics);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const maxDailyViews = useMemo(
    () => Math.max(1, ...analytics.daily.map((point) => point.views)),
    [analytics.daily],
  );
  const metrics: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: "Total views", value: analytics.totalViews, Icon: Eye },
    { label: "Unique visitors", value: analytics.uniqueVisitors, Icon: Users },
    { label: "Last 30 days", value: analytics.viewsLast30Days, Icon: BarChart3 },
    { label: "Messages", value: analytics.messages, Icon: FileText },
  ];

  function update<K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function createNew() {
    setForm({ ...initialForm, publishedAt: new Date().toISOString().slice(0, 16) });
    setEditorOpen(true);
    setNotice("");
  }

  function edit(item: ContentItem) {
    setForm({
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      tags: (item.tags || []).join(", "),
      status: item.status,
      coverUrl: item.cover_url || "",
      seoTitle: item.seo_title || "",
      seoDescription: item.seo_description || "",
      canonicalUrl: item.canonical_url || "",
      readingMinutes: String(item.reading_minutes || 5),
      featured: Boolean(item.featured),
      publishedAt: new Date(item.published_at).toISOString().slice(0, 16),
    });
    setEditorOpen(true);
    setNotice("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      setNotice(result.error || "The content could not be saved.");
      return;
    }
    setNotice("Saved successfully.");
    setEditorOpen(false);
    await load();
  }

  async function remove(item: ContentItem) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/content?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (response.ok) await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="admin-shell min-h-screen">
      <header className="border-b border-white/10 bg-zinc-950/90">
        <div className="container-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <div><p className="font-semibold text-white">KobbyOps Admin</p><p className="text-xs text-zinc-500">Publishing & performance</p></div>
          <div className="flex gap-2">
            <Link className="button button-secondary" href="/" target="_blank">View site <ArrowUpRight size={15} /></Link>
            <button className="button button-secondary" type="button" onClick={logout}><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="container-shell py-10">
        <div className="flex gap-2 border-b border-white/10">
          <button className={`admin-tab ${tab === "content" ? "admin-tab-active" : ""}`} onClick={() => setTab("content")}><FileText size={16} /> Content</button>
          <button className={`admin-tab ${tab === "analytics" ? "admin-tab-active" : ""}`} onClick={() => setTab("analytics")}><BarChart3 size={16} /> Analytics</button>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center text-zinc-500"><LoaderCircle className="animate-spin" size={24} /></div>
        ) : tab === "content" ? (
          <section className="py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h1 className="text-2xl font-semibold text-white">Blogs & insights</h1><p className="mt-2 text-sm text-zinc-500">Write in Markdown, save drafts, and publish server-rendered pages.</p></div>
              <button className="button button-primary" type="button" onClick={createNew}><Plus size={16} /> New publication</button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs"><span className="status-badge status-published">{analytics.published} published</span><span className="status-badge status-draft">{analytics.drafts} drafts</span></div>
            {notice && <p className="mt-5 text-sm text-teal-300" role="status">{notice}</p>}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              {items.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">No database publications yet. The starter articles remain available from source files.</div>
              ) : items.map((item) => (
                <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between" key={item.id}>
                  <div><div className="flex flex-wrap items-center gap-2"><span className={`status-badge ${item.status === "published" ? "status-published" : "status-draft"}`}>{item.status}</span><span className="text-xs capitalize text-zinc-500">{item.type}</span></div><p className="mt-2 font-medium text-white">{item.title}</p><p className="mt-1 text-xs text-zinc-600">/{item.type === "blog" ? "blog" : "insights"}/{item.slug}</p></div>
                  <div className="flex gap-2">
                    {item.status === "published" && <Link className="icon-link" href={`/${item.type === "blog" ? "blog" : "insights"}/${item.slug}`} target="_blank" aria-label="View published page"><Eye size={16} /></Link>}
                    <button className="icon-link" type="button" onClick={() => edit(item)} aria-label="Edit publication"><Edit3 size={16} /></button>
                    <button className="icon-link text-rose-400" type="button" onClick={() => remove(item)} aria-label="Delete publication"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="py-8">
            <div><h1 className="text-2xl font-semibold text-white">Site analytics</h1><p className="mt-2 text-sm text-zinc-500">Privacy-friendly traffic recorded without storing visitor IP addresses.</p></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map(({ label, value, Icon }) => (
                <div className="surface-card p-5" key={label}><span className="skill-icon"><Icon size={18} /></span><p className="mt-5 text-3xl font-semibold text-white">{value}</p><p className="mt-1 text-sm text-zinc-500">{label}</p></div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="surface-card p-6"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Views · 14 days</h2><span className="text-xs text-zinc-600">Daily</span></div><div className="mt-8 flex h-52 items-end gap-2">{analytics.daily.map((point) => <div className="group flex min-w-0 flex-1 flex-col items-center gap-2" key={point.date}><span className="text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100">{point.views}</span><div className="w-full rounded-t bg-gradient-to-t from-teal-700 to-teal-400" style={{ height: `${Math.max(3, (point.views / maxDailyViews) * 160)}px` }} /><span className="hidden text-[9px] text-zinc-700 sm:block">{point.date.slice(5)}</span></div>)}</div></div>
              <div className="surface-card p-6"><h2 className="font-semibold text-white">Top pages</h2><div className="mt-5 space-y-4">{analytics.topPages.length ? analytics.topPages.map((page) => <div className="flex items-center justify-between gap-4 text-sm" key={page.path}><span className="truncate text-zinc-400">{page.path}</span><span className="font-mono text-xs text-teal-400">{page.views}</span></div>) : <p className="text-sm text-zinc-600">No visits recorded yet.</p>}</div></div>
            </div>
            <div className="surface-card mt-6 p-6">
              <div className="flex items-center justify-between gap-4"><h2 className="font-semibold text-white">Recent contact messages</h2><span className="text-xs text-zinc-600">Latest 20</span></div>
              <div className="mt-5 divide-y divide-white/10">
                {analytics.recentMessages.length ? analytics.recentMessages.map((message) => (
                  <article className="py-5 first:pt-0 last:pb-0" key={message.id}>
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div><p className="font-medium text-white">{message.subject}</p><p className="mt-1 text-xs text-zinc-500">{message.name} · <a className="text-teal-400 hover:text-teal-300" href={`mailto:${message.email}`}>{message.email}</a></p></div>
                      <time className="shrink-0 text-xs text-zinc-600">{new Date(message.created_at).toLocaleDateString("en-GB")}</time>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">{message.message}</p>
                  </article>
                )) : <p className="text-sm text-zinc-600">No contact messages yet.</p>}
              </div>
            </div>
          </section>
        )}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Publisher</p><h2 className="text-2xl font-semibold text-white">{form.id ? "Edit publication" : "New publication"}</h2></div><button className="button button-secondary" type="button" onClick={() => setEditorOpen(false)}>Close</button></div>
            <form className="mt-7" onSubmit={save}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-label">Type<select className="form-input" value={form.type} onChange={(event) => update("type", event.target.value as "blog" | "insight")}><option value="blog">Blog</option><option value="insight">Insight</option></select></label>
                <label className="form-label">Status<select className="form-input" value={form.status} onChange={(event) => update("status", event.target.value as "draft" | "published")}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              </div>
              <label className="form-label mt-5">Title<input className="form-input" value={form.title} onChange={(event) => update("title", event.target.value)} required /></label>
              <label className="form-label mt-5">Slug <span className="text-zinc-700">(optional; generated from title)</span><input className="form-input font-mono" value={form.slug} onChange={(event) => update("slug", event.target.value)} /></label>
              <label className="form-label mt-5">Excerpt<textarea className="form-input min-h-24" value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} required maxLength={320} /></label>
              <label className="form-label mt-5">Content <span className="text-zinc-700">(Markdown)</span><textarea className="form-input min-h-80 font-mono text-sm leading-6" value={form.content} onChange={(event) => update("content", event.target.value)} required /></label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="form-label">Tags <span className="text-zinc-700">(comma separated)</span><input className="form-input" value={form.tags} onChange={(event) => update("tags", event.target.value)} /></label><label className="form-label">Reading time<input className="form-input" type="number" min="1" max="60" value={form.readingMinutes} onChange={(event) => update("readingMinutes", event.target.value)} /></label></div>
              <label className="form-label mt-5">Cover image URL<input className="form-input" type="url" value={form.coverUrl} onChange={(event) => update("coverUrl", event.target.value)} /></label>
              <div className="mt-7 border-t border-white/10 pt-7"><p className="eyebrow">Search preview</p><div className="grid gap-5 sm:grid-cols-2"><label className="form-label">SEO title<input className="form-input" value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} maxLength={180} /></label><label className="form-label">Canonical URL<input className="form-input" type="url" value={form.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} /></label></div><label className="form-label mt-5">SEO description<textarea className="form-input min-h-24" value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} maxLength={320} /></label></div>
              <div className="mt-6 flex flex-wrap items-center gap-5"><label className="inline-flex items-center gap-2 text-sm text-zinc-400"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Feature this publication</label><label className="form-label flex-1">Publish date<input className="form-input" type="datetime-local" value={form.publishedAt} onChange={(event) => update("publishedAt", event.target.value)} /></label></div>
              {notice && <p className="mt-5 text-sm text-rose-400" role="alert">{notice}</p>}
              <div className="mt-7 flex justify-end gap-3"><button className="button button-secondary" type="button" onClick={() => setEditorOpen(false)}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}{saving ? "Saving" : "Save publication"}</button></div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
