import type { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin, PhoneCall } from "lucide-react";
import ContactForm from "@/components/site/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Cobbina Emmanuel in Ghana about software engineering, cloud architecture, backend systems, AWS, DevOps, platform engineering, and technical collaboration.",
  alternates: { canonical: "/contact" },
};

const contacts = [
  { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  { label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone}`, icon: PhoneCall },
  { label: "LinkedIn", value: "cobbina-emmanuel", href: siteConfig.linkedin, icon: Linkedin },
  { label: "GitHub", value: "Kobby-Jones", href: siteConfig.github, icon: Github },
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell max-w-4xl text-center">
          <p className="eyebrow">Contact</p>
          <h1 className="page-title">Let&apos;s discuss the system you need to build, improve, or deliver.</h1>
          <p className="page-description mx-auto">
            Share the context, current constraints, and the outcome you are working toward. I am happy to talk about software, cloud platforms, backend architecture, delivery automation, or technical research.
          </p>
        </div>
      </section>
      <section className="section-space border-t border-white/10">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside>
            <div className="surface-card p-6 md:p-8">
              <p className="eyebrow">Direct channels</p>
              <div className="space-y-3">
                {contacts.map((contact) => {
                  const Icon = contact.icon;
                  const external = contact.href.startsWith("http");
                  return (
                    <a className="contact-row" href={contact.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} key={contact.label}>
                      <span className="skill-icon"><Icon size={18} /></span>
                      <span><strong>{contact.label}</strong><small>{contact.value}</small></span>
                    </a>
                  );
                })}
              </div>
              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="inline-flex items-center gap-2 text-sm text-zinc-400"><MapPin size={16} className="text-teal-400" /> {siteConfig.location}</p>
                <p className="mt-3 text-xs leading-6 text-zinc-600">Messages submitted here are used only to reply to your enquiry.</p>
              </div>
            </div>
          </aside>
          <div>
            <div className="mb-6"><p className="eyebrow">Send a message</p><h2 className="text-2xl font-semibold text-white">Tell me what you are working on.</h2></div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
