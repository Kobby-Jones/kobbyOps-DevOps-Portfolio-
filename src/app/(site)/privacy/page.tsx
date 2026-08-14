import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Cobbina Emmanuel portfolio website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article>
      <header className="page-hero">
        <div className="container-shell max-w-3xl"><p className="eyebrow">Privacy</p><h1 className="page-title">A small amount of data, used for clear purposes.</h1><p className="page-description">Last updated 13 August 2026.</p></div>
      </header>
      <section className="section-space border-t border-white/10">
        <div className="container-shell max-w-3xl prose-article">
          <h2>Visitor analytics</h2>
          <p>This site records the page visited, time, referring website, and a pseudonymous browser identifier so I can understand aggregate traffic and improve useful content. It does not store your IP address in the portfolio database. Analytics are skipped when the browser sends a Do Not Track signal.</p>
          <h2>Contact messages</h2>
          <p>If you use the contact form, the name, email address, subject, and message you submit are stored so I can respond. You can avoid the form and contact me directly by email.</p>
          <h2>Local storage</h2>
          <p>A random visitor identifier may be saved in local storage for anonymous visit counts. It is not used for advertising or cross-site tracking.</p>
          <h2>Your choices</h2>
          <p>You can enable Do Not Track, clear local storage, or contact me to request deletion of a message you submitted.</p>
          <h2>Contact</h2>
          <p>For a privacy question, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
        </div>
      </section>
    </article>
  );
}
