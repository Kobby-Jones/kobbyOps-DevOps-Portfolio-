"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container-shell flex h-[76px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="Cobbina Emmanuel home">
          <span className="brand-mark" aria-hidden="true">
            CE
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-white">
              Cobbina Emmanuel
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 transition-colors group-hover:text-teal-400">
              Software & Cloud Engineer
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(link.href) ? "nav-link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="button button-primary">
            Start a conversation <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-200 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          className="container-shell border-t border-white/10 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="surface-card flex flex-col p-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-teal-400/10 text-teal-300"
                    : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
