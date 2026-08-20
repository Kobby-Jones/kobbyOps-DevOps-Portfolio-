"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import TrackedLink from "@/components/site/TrackedLink";

type NavItem =
  | { href: string; label: string }
  | { label: string; children: { href: string; label: string; description?: string }[] };

const navigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Engineering",
    children: [
      { href: "/projects", label: "Projects", description: "Selected engineering work with visible architecture" },
      { href: "/projects#case-studies", label: "Case Studies", description: "Problem → architecture → outcome breakdowns" },
    ],
  },
  {
    label: "Services",
    children: [
      { href: "/services/cloud-devops", label: "Cloud & DevOps", description: "Deploy and operate reliable infrastructure" },
      { href: "/services/backend-engineering", label: "Backend Engineering", description: "APIs, data layer, and server-side systems" },
      { href: "/services/production-readiness-audit", label: "Production Readiness Audit", description: "Review systems before they go live" },
      { href: "/services/architecture-consulting", label: "Architecture Consulting", description: "Evaluate and plan system architectures" },
    ],
  },
  {
    label: "Writing",
    children: [
      { href: "/blog", label: "Blog", description: "Technical articles and engineering notes" },
      { href: "/insights", label: "Insights", description: "Short engineering notes on systems and practice" },
    ],
  },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
];

function hasChildren(item: NavItem): item is Extract<NavItem, { children: unknown }> {
  return "children" in item;
}

function isActivePrefix(pathname: string, item: NavItem): boolean {
  if (hasChildren(item)) {
    return item.children.some((child) =>
      child.href === "/" ? pathname === "/" : pathname.startsWith(child.href.split("#")[0]),
    );
  }
  return item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
}

// ─── Desktop dropdown ────────────────────────────────────────────────────────

function DesktopDropdown({
  item,
  active,
}: {
  item: Extract<NavItem, { children: unknown }>;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const enter = useCallback(() => {
    clearTimeout(timeout.current);
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        type="button"
        className={`nav-link nav-dropdown-trigger ${active ? "nav-link-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="nav-dropdown" role="menu">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="nav-dropdown-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="nav-dropdown-item-label">{child.label}</span>
              {child.description && (
                <span className="nav-dropdown-item-desc">{child.description}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile accordion ────────────────────────────────────────────────────────

function MobileAccordion({
  item,
  active,
}: {
  item: Extract<NavItem, { children: unknown }>;
  active: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${
          active
            ? "bg-teal-400/10 text-teal-300"
            : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
        }`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.04] hover:text-white"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container-shell flex h-[76px] items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Cobbina Emmanuel home"
        >
          <span className="brand-mark" aria-hidden="true">
            <Image
              src="/android-chrome-192x192.png"
              alt=""
              width={44}
              height={44}
              className="brand-mark-logo"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-white">
              Cobbina Emmanuel
            </span>
            <span className="block text-[11px] font-medium tracking-[0.04em] text-zinc-500 transition-colors group-hover:text-teal-400">
              Software and Cloud Engineer
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) =>
            hasChildren(item) ? (
              <DesktopDropdown
                key={item.label}
                item={item}
                active={isActivePrefix(pathname, item)}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActivePrefix(pathname, item) ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <TrackedLink
            href="/work-with-me"
            className="button button-primary"
            analyticsLabel="navbar_work_with_me"
            analyticsMetadata={{ placement: "desktop_nav" }}
          >
            Work with me <ArrowUpRight size={16} aria-hidden="true" />
          </TrackedLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-200 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="container-shell border-t border-white/10 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="surface-card flex flex-col gap-0.5 p-2">
            {navigation.map((item) =>
              hasChildren(item) ? (
                <MobileAccordion
                  key={item.label}
                  item={item}
                  active={isActivePrefix(pathname, item)}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    isActivePrefix(pathname, item)
                      ? "bg-teal-400/10 text-teal-300"
                      : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="mt-2 border-t border-white/10 pt-3">
              <TrackedLink
                href="/work-with-me"
                className="button button-primary w-full justify-center"
                analyticsLabel="navbar_work_with_me"
                analyticsMetadata={{ placement: "mobile_nav" }}
              >
                Work with me <ArrowUpRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
