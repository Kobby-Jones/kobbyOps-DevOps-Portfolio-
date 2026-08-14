import Link from "next/link";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="container-shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="brand-mark" aria-hidden="true">CE</span>
              <div>
                <p className="font-semibold text-white">Cobbina Emmanuel</p>
                <p className="text-sm text-zinc-500">Software & Cloud Engineer</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Building secure software, cloud platforms, delivery systems, and practical engineering knowledge from Ghana.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
              <MapPin size={15} className="text-teal-400" aria-hidden="true" />
              {siteConfig.location}
            </p>
          </div>

          <div>
            <p className="footer-title">Explore</p>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link className="footer-link" href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-title">Connect</p>
            <div className="mt-4 flex gap-2">
              <a className="social-link" href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                <Github size={18} />
              </a>
              <a className="social-link" href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                <Linkedin size={18} />
              </a>
              <a className="social-link" href={`mailto:${siteConfig.email}`} aria-label="Email Cobbina Emmanuel">
                <Mail size={18} />
              </a>
            </div>
            <a className="footer-link mt-5 inline-block" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cobbina Emmanuel. All rights reserved.</p>
          <p>Designed for clarity, accessibility, and search discovery.</p>
        </div>
      </div>
    </footer>
  );
}
