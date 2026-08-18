"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Edit3,
  Eye,
  FileText,
  LoaderCircle,
  LogOut,
  Package,
  Plus,
  Save,
  Settings,
  ShoppingCart,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

// ─── Content types ───────────────────────────────────────────────────────────

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
  serviceViews: number;
  ctaClicks: number;
  checkoutInitiations: number;
  topPages: { path: string; views: number }[];
  daily: { date: string; views: number }[];
  recentConversions: {
    eventName: string;
    label: string | null;
    path: string;
    createdAt: string;
  }[];
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
  serviceViews: 0,
  ctaClicks: 0,
  checkoutInitiations: 0,
  topPages: [],
  daily: [],
  recentConversions: [],
  recentMessages: [],
};

// ─── Initial form shapes ─────────────────────────────────────────────────────

const initialContentForm = {
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

const initialResourceForm = {
  id: "",
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  type: "free_resource" as "free_resource" | "paid_product",
  category: "engineering",
  price: "0",
  currency: "USD",
  thumbnailUrl: "",
  fileUrl: "",
  externalUrl: "",
  status: "draft" as "draft" | "published",
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

const initialServiceForm = {
  id: "",
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  icon: "",
  capabilities: "",
  priceLabel: "",
  displayOrder: "0",
  status: "draft" as "draft" | "published",
  seoTitle: "",
  seoDescription: "",
};

const RESOURCE_CATEGORIES = [
  "engineering", "aws", "docker", "devops", "kubernetes", "backend", "ci_cd", "career",
];

const CONSULTATION_STATUSES = ["new", "reviewed", "responded", "converted", "archived"];

// ─── Component ───────────────────────────────────────────────────────────────

function useModalFocus(
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(selector))
      .filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');

    (focusable()[0] || dialog).focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        dialog!.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open, setOpen]);

  return dialogRef;
}

export default function AdminConsole() {
  const [tab, setTab] = useState<"content" | "analytics" | "resources" | "services" | "consultations" | "orders">("content");

  // Data
  const [items, setItems] = useState<ContentItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>(emptyAnalytics);
  const [resourceItems, setResourceItems] = useState<Record<string, unknown>[]>([]);
  const [serviceItems, setServiceItems] = useState<Record<string, unknown>[]>([]);
  const [consultationItems, setConsultationItems] = useState<Record<string, unknown>[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, unknown>[]>([]);

  // Forms
  const [contentForm, setContentForm] = useState(initialContentForm);
  const [resourceForm, setResourceForm] = useState(initialResourceForm);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);

  // UI
  const [contentEditorOpen, setContentEditorOpen] = useState(false);
  const [resourceEditorOpen, setResourceEditorOpen] = useState(false);
  const [serviceEditorOpen, setServiceEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const contentDialogRef = useModalFocus(contentEditorOpen, setContentEditorOpen);
  const resourceDialogRef = useModalFocus(resourceEditorOpen, setResourceEditorOpen);
  const serviceDialogRef = useModalFocus(serviceEditorOpen, setServiceEditorOpen);

  // ─── Load all data ──────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    const [contentR, analyticsR, resourcesR, servicesR, consultationsR, ordersR] = await Promise.all([
      fetch("/api/admin/content", { cache: "no-store" }),
      fetch("/api/admin/analytics", { cache: "no-store" }),
      fetch("/api/admin/resources", { cache: "no-store" }).catch(() => null),
      fetch("/api/admin/services", { cache: "no-store" }).catch(() => null),
      fetch("/api/admin/consultations", { cache: "no-store" }).catch(() => null),
      fetch("/api/admin/orders", { cache: "no-store" }).catch(() => null),
    ]);
    if (contentR.ok) setItems((await contentR.json()).items || []);
    else {
      const r = await contentR.json().catch(() => ({}));
      setNotice(r.error || "Content storage is unavailable.");
    }
    if (analyticsR.ok) setAnalytics((await analyticsR.json()).analytics || emptyAnalytics);
    if (resourcesR?.ok) setResourceItems((await resourcesR.json()).items || []);
    if (servicesR?.ok) setServiceItems((await servicesR.json()).items || []);
    if (consultationsR?.ok) setConsultationItems((await consultationsR.json()).items || []);
    if (ordersR?.ok) setOrderItems((await ordersR.json()).items || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ─── Content CRUD ───────────────────────────────────────────────────────

  function updateContent<K extends keyof typeof initialContentForm>(key: K, value: (typeof initialContentForm)[K]) {
    setContentForm((prev) => ({ ...prev, [key]: value }));
  }

  function createNewContent() {
    setContentForm(initialContentForm);
    setNotice("");
    setContentEditorOpen(true);
  }

  function editContent(item: ContentItem) {
    setContentForm({
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
      publishedAt: item.published_at?.slice(0, 16) || new Date().toISOString().slice(0, 16),
    });
    setNotice("");
    setContentEditorOpen(true);
  }

  async function saveContent(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contentForm),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) { setNotice(result.error || "Save failed."); return; }
    setContentEditorOpen(false);
    setNotice(`"${contentForm.title}" saved.`);
    load();
  }

  async function removeContent(item: ContentItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await fetch(`/api/admin/content?id=${item.id}`, { method: "DELETE" });
    setNotice(`"${item.title}" deleted.`);
    load();
  }

  // ─── Resource CRUD ──────────────────────────────────────────────────────

  function updateResource<K extends keyof typeof initialResourceForm>(key: K, value: (typeof initialResourceForm)[K]) {
    setResourceForm((prev) => ({ ...prev, [key]: value }));
  }

  function createNewResource() {
    setResourceForm(initialResourceForm);
    setNotice("");
    setResourceEditorOpen(true);
  }

  function editResource(item: Record<string, unknown>) {
    setResourceForm({
      id: String(item.id || ""),
      title: String(item.title || ""),
      slug: String(item.slug || ""),
      shortDescription: String(item.short_description || ""),
      description: String(item.description || ""),
      type: (String(item.type) === "paid_product" ? "paid_product" : "free_resource"),
      category: String(item.category || "engineering"),
      price: String(item.price ?? "0"),
      currency: String(item.currency || "USD"),
      thumbnailUrl: String(item.thumbnail_url || ""),
      fileUrl: String(item.file_url || ""),
      externalUrl: String(item.external_url || ""),
      status: (String(item.status) === "published" ? "published" : "draft"),
      featured: Boolean(item.featured),
      seoTitle: String(item.seo_title || ""),
      seoDescription: String(item.seo_description || ""),
    });
    setNotice("");
    setResourceEditorOpen(true);
  }

  async function saveResource(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resourceForm),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) { setNotice(result.error || "Save failed."); return; }
    setResourceEditorOpen(false);
    setNotice(`"${resourceForm.title}" saved.`);
    load();
  }

  async function removeResource(item: Record<string, unknown>) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await fetch(`/api/admin/resources?id=${item.id}`, { method: "DELETE" });
    setNotice(`"${item.title}" deleted.`);
    load();
  }

  // ─── Service CRUD ───────────────────────────────────────────────────────

  function updateService<K extends keyof typeof initialServiceForm>(key: K, value: (typeof initialServiceForm)[K]) {
    setServiceForm((prev) => ({ ...prev, [key]: value }));
  }

  function createNewService() {
    setServiceForm(initialServiceForm);
    setNotice("");
    setServiceEditorOpen(true);
  }

  function editService(item: Record<string, unknown>) {
    setServiceForm({
      id: String(item.id || ""),
      title: String(item.title || ""),
      slug: String(item.slug || ""),
      shortDescription: String(item.short_description || ""),
      description: String(item.description || ""),
      icon: String(item.icon || ""),
      capabilities: Array.isArray(item.capabilities) ? item.capabilities.join("\n") : String(item.capabilities || ""),
      priceLabel: String(item.price_label || ""),
      displayOrder: String(item.display_order ?? "0"),
      status: (String(item.status) === "published" ? "published" : "draft"),
      seoTitle: String(item.seo_title || ""),
      seoDescription: String(item.seo_description || ""),
    });
    setNotice("");
    setServiceEditorOpen(true);
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceForm),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) { setNotice(result.error || "Save failed."); return; }
    setServiceEditorOpen(false);
    setNotice(`"${serviceForm.title}" saved.`);
    load();
  }

  async function removeService(item: Record<string, unknown>) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await fetch(`/api/admin/services?id=${item.id}`, { method: "DELETE" });
    setNotice(`"${item.title}" deleted.`);
    load();
  }

  // ─── Consultation status ────────────────────────────────────────────────

  async function updateConsultationStatus(id: string, status: string) {
    await fetch("/api/admin/consultations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  // ─── Logout ─────────────────────────────────────────────────────────────

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  // ─── Metrics ────────────────────────────────────────────────────────────

  const { Eye: EyeIcon, Users: UsersIcon, BarChart3: ChartIcon, FileText: FileIcon } = { Eye, Users, BarChart3, FileText };
  const metrics: { label: string; value: number | string; Icon: LucideIcon }[] = useMemo(
    () => [
      { label: "Total views", value: analytics.totalViews.toLocaleString(), Icon: EyeIcon },
      { label: "Unique visitors", value: analytics.uniqueVisitors.toLocaleString(), Icon: UsersIcon },
      { label: "Views (30 d)", value: analytics.viewsLast30Days.toLocaleString(), Icon: ChartIcon },
      { label: "Contact messages", value: analytics.messages.toLocaleString(), Icon: FileIcon },
    ],
    [analytics, EyeIcon, UsersIcon, ChartIcon, FileIcon],
  );
  const maxDailyViews = Math.max(1, ...analytics.daily.map((d) => d.views));

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <main className="admin-shell min-h-screen">
      <header className="border-b border-white/10 bg-zinc-950/90">
        <div className="container-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <div><p className="font-semibold text-white">KobbyOps Admin</p><p className="text-xs text-zinc-500">Publishing, services & performance</p></div>
          <div className="flex gap-2">
            <Link className="button button-secondary" href="/" target="_blank">View site <ArrowUpRight size={15} /></Link>
            <button className="button button-secondary" type="button" onClick={logout}><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="container-shell py-10">
        <nav className="admin-tab-list flex gap-2 overflow-x-auto border-b border-white/10" aria-label="Admin sections">
          <button type="button" aria-pressed={tab === "content"} className={`admin-tab ${tab === "content" ? "admin-tab-active" : ""}`} onClick={() => setTab("content")}><FileText size={16} aria-hidden="true" /> Content</button>
          <button type="button" aria-pressed={tab === "resources"} className={`admin-tab ${tab === "resources" ? "admin-tab-active" : ""}`} onClick={() => setTab("resources")}><Package size={16} aria-hidden="true" /> Resources</button>
          <button type="button" aria-pressed={tab === "services"} className={`admin-tab ${tab === "services" ? "admin-tab-active" : ""}`} onClick={() => setTab("services")}><Settings size={16} aria-hidden="true" /> Services</button>
          <button type="button" aria-pressed={tab === "consultations"} className={`admin-tab ${tab === "consultations" ? "admin-tab-active" : ""}`} onClick={() => setTab("consultations")}><Users size={16} aria-hidden="true" /> Leads</button>
          <button type="button" aria-pressed={tab === "orders"} className={`admin-tab ${tab === "orders" ? "admin-tab-active" : ""}`} onClick={() => setTab("orders")}><ShoppingCart size={16} aria-hidden="true" /> Orders</button>
          <button type="button" aria-pressed={tab === "analytics"} className={`admin-tab ${tab === "analytics" ? "admin-tab-active" : ""}`} onClick={() => setTab("analytics")}><BarChart3 size={16} aria-hidden="true" /> Analytics</button>
        </nav>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center text-zinc-500"><LoaderCircle className="animate-spin" size={24} /></div>

        ) : tab === "content" ? (
          <section className="py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h1 className="text-2xl font-semibold text-white">Blogs & insights</h1><p className="mt-2 text-sm text-zinc-500">Write in Markdown, save drafts, and publish server-rendered pages.</p></div>
              <button className="button button-primary" type="button" onClick={createNewContent}><Plus size={16} /> New publication</button>
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
                    {item.status === "published" && <Link className="icon-link" href={`/${item.type === "blog" ? "blog" : "insights"}/${item.slug}`} target="_blank" aria-label="View"><Eye size={16} /></Link>}
                    <button className="icon-link" type="button" onClick={() => editContent(item)} aria-label="Edit"><Edit3 size={16} /></button>
                    <button className="icon-link text-rose-400" type="button" onClick={() => removeContent(item)} aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        ) : tab === "resources" ? (
          <section className="py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h1 className="text-2xl font-semibold text-white">Resources & products</h1><p className="mt-2 text-sm text-zinc-500">Free resources and paid digital products.</p></div>
              <button className="button button-primary" type="button" onClick={createNewResource}><Plus size={16} /> New resource</button>
            </div>
            {notice && <p className="mt-5 text-sm text-teal-300" role="status">{notice}</p>}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              {resourceItems.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">No resources yet. Click &quot;New resource&quot; to create one.</div>
              ) : resourceItems.map((item) => (
                <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between" key={String(item.id)}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`status-badge ${item.status === "published" ? "status-published" : "status-draft"}`}>{String(item.status)}</span>
                      <span className="text-xs uppercase text-zinc-500">{String(item.type) === "paid_product" ? "Paid" : "Free"}</span>
                      <span className="text-xs text-zinc-600 capitalize">{String(item.category)}</span>
                    </div>
                    <p className="mt-2 font-medium text-white">{String(item.title)}</p>
                    <p className="mt-1 text-xs text-zinc-600">/resources/{String(item.slug)} · {String(item.currency)} {Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="icon-link" type="button" onClick={() => editResource(item)} aria-label="Edit"><Edit3 size={16} /></button>
                    <button className="icon-link text-rose-400" type="button" onClick={() => removeResource(item)} aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        ) : tab === "services" ? (
          <section className="py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h1 className="text-2xl font-semibold text-white">Services</h1><p className="mt-2 text-sm text-zinc-500">Manage service offerings. Static defaults apply until database records exist.</p></div>
              <button className="button button-primary" type="button" onClick={createNewService}><Plus size={16} /> New service</button>
            </div>
            {notice && <p className="mt-5 text-sm text-teal-300" role="status">{notice}</p>}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              {serviceItems.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">Services are loaded from source files. Create database records here to override them.</div>
              ) : serviceItems.map((item) => (
                <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between" key={String(item.id)}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`status-badge ${item.status === "published" ? "status-published" : "status-draft"}`}>{String(item.status)}</span>
                      <span className="text-xs text-zinc-500">Order: {String(item.display_order)}</span>
                    </div>
                    <p className="mt-2 font-medium text-white">{String(item.title)}</p>
                    <p className="mt-1 text-xs text-zinc-600">/services/{String(item.slug)}</p>
                  </div>
                  <div className="flex gap-2">
                    {item.status === "published" && <Link className="icon-link" href={`/services/${String(item.slug)}`} target="_blank" aria-label="View"><Eye size={16} /></Link>}
                    <button className="icon-link" type="button" onClick={() => editService(item)} aria-label="Edit"><Edit3 size={16} /></button>
                    <button className="icon-link text-rose-400" type="button" onClick={() => removeService(item)} aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        ) : tab === "consultations" ? (
          <section className="py-8">
            <div><h1 className="text-2xl font-semibold text-white">Consultation requests</h1><p className="mt-2 text-sm text-zinc-500">Leads from the Work With Me form.</p></div>
            <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
              {consultationItems.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">No consultation requests yet.</div>
              ) : consultationItems.map((item) => (
                <article className="bg-white/[0.02] p-5" key={String(item.id)}>
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-teal-400">{String(item.service_requested)}</span>
                        <span className="text-xs text-zinc-600">·</span>
                        <span className="text-xs text-zinc-500">{new Date(String(item.created_at)).toLocaleDateString("en-GB")}</span>
                      </div>
                      <p className="mt-2 font-medium text-white">{String(item.name)}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        <a className="text-teal-400 hover:text-teal-300" href={`mailto:${String(item.email)}`}>{String(item.email)}</a>
                        {item.organization ? ` · ${String(item.organization)}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.budget_range ? <span className="text-xs text-zinc-600">{String(item.budget_range)}</span> : null}
                      {item.timeline ? <span className="text-xs text-zinc-600">· {String(item.timeline)}</span> : null}
                      <select
                        className="form-input ml-2 !mt-0 !w-auto !min-w-28 !py-1.5 !text-xs"
                        value={String(item.status)}
                        onChange={(e) => updateConsultationStatus(String(item.id), e.target.value)}
                      >
                        {CONSULTATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">{String(item.project_description)}</p>
                  {item.website_url ? <a className="mt-2 block text-xs text-teal-400 hover:text-teal-300" href={String(item.website_url)} target="_blank" rel="noreferrer">{String(item.website_url)}</a> : null}
                </article>
              ))}
            </div>
          </section>

        ) : tab === "orders" ? (
          <section className="py-8">
            <div><h1 className="text-2xl font-semibold text-white">Orders</h1><p className="mt-2 text-sm text-zinc-500">Read-only payment and product order history.</p></div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              {orderItems.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">No orders yet.</div>
              ) : orderItems.map((item) => {
                const resource = item.resource as { title?: string } | { title?: string }[] | null | undefined;
                const productTitle = Array.isArray(resource) ? resource[0]?.title : resource?.title;
                const paid = String(item.status) === "paid";
                return (
                  <article className="border-b border-white/10 bg-white/[0.02] p-5 last:border-0" key={String(item.id)}>
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`status-badge ${paid ? "status-published" : "status-draft"}`}>{String(item.status)}</span>
                          <span className="text-xs text-zinc-500">{new Date(String(item.created_at)).toLocaleDateString("en-GB")}</span>
                        </div>
                        <p className="mt-3 font-medium text-white">{productTitle || "Resource"}</p>
                        <p className="mt-1 text-sm text-zinc-400">{String(item.customer_name)}</p>
                        <a className="mt-1 block text-xs text-teal-400 hover:text-teal-300" href={`mailto:${String(item.customer_email)}`}>{String(item.customer_email)}</a>
                      </div>
                      <div className="grid gap-3 text-sm sm:grid-cols-2 lg:min-w-[26rem]">
                        <div><p className="text-xs uppercase tracking-wider text-zinc-600">Amount</p><p className="mt-1 text-zinc-300">{String(item.currency)} {Number(item.amount).toFixed(2)}</p></div>
                        <div><p className="text-xs uppercase tracking-wider text-zinc-600">Provider</p><p className="mt-1 capitalize text-zinc-300">{String(item.payment_provider || "—")}</p></div>
                        <div className="sm:col-span-2"><p className="text-xs uppercase tracking-wider text-zinc-600">Payment reference</p><p className="mt-1 break-all font-mono text-xs text-zinc-400">{String(item.payment_reference || "—")}</p></div>
                      </div>
                    </div>
                  </article>
                );
              })}
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
            <div className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div><h2 className="font-semibold text-white">Conversion events · 30 days</h2><p className="mt-1 text-xs text-zinc-600">Service interest and commerce actions, kept separate from page views.</p></div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="surface-card p-5"><p className="text-3xl font-semibold text-white">{analytics.serviceViews.toLocaleString()}</p><p className="mt-1 text-sm text-zinc-500">Service page views</p></div>
                <div className="surface-card p-5"><p className="text-3xl font-semibold text-white">{analytics.ctaClicks.toLocaleString()}</p><p className="mt-1 text-sm text-zinc-500">CTA clicks</p></div>
                <div className="surface-card p-5"><p className="text-3xl font-semibold text-white">{analytics.checkoutInitiations.toLocaleString()}</p><p className="mt-1 text-sm text-zinc-500">Checkout starts</p></div>
              </div>
              <div className="surface-card mt-4 p-6">
                <div className="flex items-center justify-between gap-4"><h3 className="font-semibold text-white">Recent conversion activity</h3><span className="text-xs text-zinc-600">Latest 20</span></div>
                <div className="mt-5 divide-y divide-white/10">
                  {analytics.recentConversions.length ? analytics.recentConversions.map((event, index) => (
                    <div className="flex flex-col justify-between gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center" key={`${event.eventName}-${event.createdAt}-${index}`}>
                      <div className="min-w-0"><p className="text-sm font-medium text-zinc-300">{event.eventName.replace(/_/g, " ")}</p><p className="mt-1 truncate text-xs text-zinc-600">{event.label || event.path} · {event.path}</p></div>
                      <time className="shrink-0 text-xs text-zinc-600">{new Date(event.createdAt).toLocaleString("en-GB")}</time>
                    </div>
                  )) : <p className="text-sm text-zinc-600">No conversion events recorded yet.</p>}
                </div>
              </div>
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

      {/* ─── Content editor modal ────────────────────────────────────────── */}
      {contentEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div
            ref={contentDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-editor-title"
            tabIndex={-1}
            className="mx-auto my-6 max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl outline-none md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div><p className="eyebrow">Publisher</p><h2 id="content-editor-title" className="text-2xl font-semibold text-white">{contentForm.id ? "Edit publication" : "New publication"}</h2></div>
              <button className="icon-link" type="button" onClick={() => setContentEditorOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <form className="mt-7" onSubmit={saveContent}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-label">Type<select className="form-input" value={contentForm.type} onChange={(e) => updateContent("type", e.target.value as "blog" | "insight")}><option value="blog">Blog</option><option value="insight">Insight</option></select></label>
                <label className="form-label">Status<select className="form-input" value={contentForm.status} onChange={(e) => updateContent("status", e.target.value as "draft" | "published")}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              </div>
              <label className="form-label mt-5">Title<input className="form-input" value={contentForm.title} onChange={(e) => updateContent("title", e.target.value)} required /></label>
              <label className="form-label mt-5">Slug <span className="text-zinc-700">(optional; generated from title)</span><input className="form-input font-mono" value={contentForm.slug} onChange={(e) => updateContent("slug", e.target.value)} /></label>
              <label className="form-label mt-5">Excerpt<textarea className="form-input min-h-24" value={contentForm.excerpt} onChange={(e) => updateContent("excerpt", e.target.value)} required maxLength={320} /></label>
              <label className="form-label mt-5">Content <span className="text-zinc-700">(Markdown)</span><textarea className="form-input min-h-80 font-mono text-sm leading-6" value={contentForm.content} onChange={(e) => updateContent("content", e.target.value)} required /></label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="form-label">Tags <span className="text-zinc-700">(comma separated)</span><input className="form-input" value={contentForm.tags} onChange={(e) => updateContent("tags", e.target.value)} /></label>
                <label className="form-label">Reading time<input className="form-input" type="number" min="1" max="60" value={contentForm.readingMinutes} onChange={(e) => updateContent("readingMinutes", e.target.value)} /></label>
              </div>
              <label className="form-label mt-5">Cover image URL<input className="form-input" type="url" value={contentForm.coverUrl} onChange={(e) => updateContent("coverUrl", e.target.value)} /></label>
              <div className="mt-7 border-t border-white/10 pt-7">
                <p className="eyebrow">Search preview</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="form-label">SEO title<input className="form-input" value={contentForm.seoTitle} onChange={(e) => updateContent("seoTitle", e.target.value)} maxLength={180} /></label>
                  <label className="form-label">Canonical URL<input className="form-input" type="url" value={contentForm.canonicalUrl} onChange={(e) => updateContent("canonicalUrl", e.target.value)} /></label>
                </div>
                <label className="form-label mt-5">SEO description<textarea className="form-input min-h-24" value={contentForm.seoDescription} onChange={(e) => updateContent("seoDescription", e.target.value)} maxLength={320} /></label>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <label className="inline-flex items-center gap-2 text-sm text-zinc-400"><input type="checkbox" checked={contentForm.featured} onChange={(e) => updateContent("featured", e.target.checked)} /> Feature this publication</label>
                <label className="form-label flex-1">Publish date<input className="form-input" type="datetime-local" value={contentForm.publishedAt} onChange={(e) => updateContent("publishedAt", e.target.value)} /></label>
              </div>
              {notice && <p className="mt-5 text-sm text-rose-400" role="alert">{notice}</p>}
              <div className="mt-7 flex justify-end gap-3">
                <button className="button button-secondary" type="button" onClick={() => setContentEditorOpen(false)}>Cancel</button>
                <button className="button button-primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}{saving ? "Saving" : "Save publication"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Resource editor modal ───────────────────────────────────────── */}
      {resourceEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div
            ref={resourceDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-editor-title"
            tabIndex={-1}
            className="mx-auto my-6 max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl outline-none md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div><p className="eyebrow">Resource editor</p><h2 id="resource-editor-title" className="text-2xl font-semibold text-white">{resourceForm.id ? "Edit resource" : "New resource"}</h2></div>
              <button className="icon-link" type="button" onClick={() => setResourceEditorOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <form className="mt-7" onSubmit={saveResource}>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className="form-label">Type
                  <select className="form-input" value={resourceForm.type} onChange={(e) => updateResource("type", e.target.value as "free_resource" | "paid_product")}>
                    <option value="free_resource">Free resource</option>
                    <option value="paid_product">Paid product</option>
                  </select>
                </label>
                <label className="form-label">Category
                  <select className="form-input" value={resourceForm.category} onChange={(e) => updateResource("category", e.target.value)}>
                    {RESOURCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="form-label">Status
                  <select className="form-input" value={resourceForm.status} onChange={(e) => updateResource("status", e.target.value as "draft" | "published")}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
              </div>
              <label className="form-label mt-5">Title<input className="form-input" value={resourceForm.title} onChange={(e) => updateResource("title", e.target.value)} required /></label>
              <label className="form-label mt-5">Slug <span className="text-zinc-700">(auto-generated if blank)</span><input className="form-input font-mono" value={resourceForm.slug} onChange={(e) => updateResource("slug", e.target.value)} /></label>
              <label className="form-label mt-5">Short description<textarea className="form-input min-h-20" value={resourceForm.shortDescription} onChange={(e) => updateResource("shortDescription", e.target.value)} required maxLength={320} /></label>
              <label className="form-label mt-5">Description <span className="text-zinc-700">(Markdown)</span><textarea className="form-input min-h-48 font-mono text-sm leading-6" value={resourceForm.description} onChange={(e) => updateResource("description", e.target.value)} required /></label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="form-label">Price<input className="form-input" type="number" min="0" step="0.01" value={resourceForm.price} onChange={(e) => updateResource("price", e.target.value)} /></label>
                <label className="form-label">Currency<input className="form-input" value={resourceForm.currency} onChange={(e) => updateResource("currency", e.target.value)} maxLength={5} /></label>
              </div>
              <label className="form-label mt-5">Thumbnail URL<input className="form-input" type="url" value={resourceForm.thumbnailUrl} onChange={(e) => updateResource("thumbnailUrl", e.target.value)} /></label>
              <label className="form-label mt-5">File URL <span className="text-zinc-700">(admin only — never public)</span><input className="form-input" value={resourceForm.fileUrl} onChange={(e) => updateResource("fileUrl", e.target.value)} /></label>
              <label className="form-label mt-5">External URL<input className="form-input" type="url" value={resourceForm.externalUrl} onChange={(e) => updateResource("externalUrl", e.target.value)} /></label>
              <div className="mt-7 border-t border-white/10 pt-7">
                <p className="eyebrow">SEO</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="form-label">SEO title<input className="form-input" value={resourceForm.seoTitle} onChange={(e) => updateResource("seoTitle", e.target.value)} maxLength={180} /></label>
                  <label className="form-label">SEO description<input className="form-input" value={resourceForm.seoDescription} onChange={(e) => updateResource("seoDescription", e.target.value)} maxLength={320} /></label>
                </div>
              </div>
              <div className="mt-5">
                <label className="inline-flex items-center gap-2 text-sm text-zinc-400"><input type="checkbox" checked={resourceForm.featured} onChange={(e) => updateResource("featured", e.target.checked)} /> Feature this resource</label>
              </div>
              {notice && <p className="mt-5 text-sm text-rose-400" role="alert">{notice}</p>}
              <div className="mt-7 flex justify-end gap-3">
                <button className="button button-secondary" type="button" onClick={() => setResourceEditorOpen(false)}>Cancel</button>
                <button className="button button-primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}{saving ? "Saving" : "Save resource"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Service editor modal ────────────────────────────────────────── */}
      {serviceEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div
            ref={serviceDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-editor-title"
            tabIndex={-1}
            className="mx-auto my-6 max-w-3xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl outline-none md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div><p className="eyebrow">Service editor</p><h2 id="service-editor-title" className="text-2xl font-semibold text-white">{serviceForm.id ? "Edit service" : "New service"}</h2></div>
              <button className="icon-link" type="button" onClick={() => setServiceEditorOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <form className="mt-7" onSubmit={saveService}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-label">Status
                  <select className="form-input" value={serviceForm.status} onChange={(e) => updateService("status", e.target.value as "draft" | "published")}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                <label className="form-label">Display order<input className="form-input" type="number" min="0" value={serviceForm.displayOrder} onChange={(e) => updateService("displayOrder", e.target.value)} /></label>
              </div>
              <label className="form-label mt-5">Title<input className="form-input" value={serviceForm.title} onChange={(e) => updateService("title", e.target.value)} required /></label>
              <label className="form-label mt-5">Slug <span className="text-zinc-700">(auto-generated if blank)</span><input className="form-input font-mono" value={serviceForm.slug} onChange={(e) => updateService("slug", e.target.value)} /></label>
              <label className="form-label mt-5">Short description<textarea className="form-input min-h-20" value={serviceForm.shortDescription} onChange={(e) => updateService("shortDescription", e.target.value)} required maxLength={320} /></label>
              <label className="form-label mt-5">Description <span className="text-zinc-700">(full service description)</span><textarea className="form-input min-h-48 font-mono text-sm leading-6" value={serviceForm.description} onChange={(e) => updateService("description", e.target.value)} required /></label>
              <label className="form-label mt-5">Capabilities <span className="text-zinc-700">(one per line)</span><textarea className="form-input min-h-40 font-mono text-sm leading-6" value={serviceForm.capabilities} onChange={(e) => updateService("capabilities", e.target.value)} placeholder={"AWS infrastructure design\nDocker containerisation\nCI/CD pipeline design"} /></label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="form-label">Icon <span className="text-zinc-700">(cloud, code, shield, layers)</span><input className="form-input" value={serviceForm.icon} onChange={(e) => updateService("icon", e.target.value)} maxLength={40} /></label>
                <label className="form-label">Price label<input className="form-input" value={serviceForm.priceLabel} onChange={(e) => updateService("priceLabel", e.target.value)} placeholder="Starting from $500" /></label>
              </div>
              <div className="mt-7 border-t border-white/10 pt-7">
                <p className="eyebrow">SEO</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="form-label">SEO title<input className="form-input" value={serviceForm.seoTitle} onChange={(e) => updateService("seoTitle", e.target.value)} maxLength={180} /></label>
                  <label className="form-label">SEO description<input className="form-input" value={serviceForm.seoDescription} onChange={(e) => updateService("seoDescription", e.target.value)} maxLength={320} /></label>
                </div>
              </div>
              {notice && <p className="mt-5 text-sm text-rose-400" role="alert">{notice}</p>}
              <div className="mt-7 flex justify-end gap-3">
                <button className="button button-secondary" type="button" onClick={() => setServiceEditorOpen(false)}>Cancel</button>
                <button className="button button-primary" type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}{saving ? "Saving" : "Save service"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
