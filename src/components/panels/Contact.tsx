"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  PhoneCall,
  MapPin,
  Copy,
  Send,
  Terminal,
  CheckCircle2,
  X,
  Rocket,
  ContactIcon
} from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("cobbina1.emmanuel@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };
  

  const contactJSON = {
    status: "online",
    contact: "tel:+233598738535",
    email: "cobbina1.emmanuel@gmail.com",
    github: "https://github.com/Kobby-Jones",
    linkedin: "https://www.linkedin.com/in/cobbina-emmanuel-376072209/",
    location: "Africa/Accra",
  };
  const isTelLink = contactJSON.contact.startsWith("tel:");

  return (
    <div className="space-y-8">
      <h2 className="text-zinc-300 font-medium">
        <ContactIcon className="inline-block mr-2 mb-1 text-teal-400" size={20} />
         Contact & Network
         </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- Left side: API view --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-zinc-400 text-sm">
                GET <span className="text-emerald-400">/api/contact</span> → 200 OK
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                online
              </div>
            </div>

            <pre className="font-mono text-sm text-teal-300 bg-black/50 rounded-xl p-3 overflow-auto">
              {JSON.stringify(contactJSON, null, 2)}
            </pre>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Copy size={12} />
              {copied ? "Copied!" : "Copy Email"}
            </button>

            <a
              href={`mailto:${contactJSON.email}`}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Mail size={12} />
              Send Mail
            </a>

            <a
              href={contactJSON.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Github size={12} />
              GitHub
            </a>

            <a
              href={contactJSON.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Linkedin size={12} />
              LinkedIn
            </a>
            <a
            href={contactJSON.contact}
            target={isTelLink ? undefined : "_blank"}
            rel={isTelLink ? undefined : "noreferrer"}
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition flex items-center gap-1"
            >
            <PhoneCall size={12} />
            Call Me
            </a>
          </div>
        </motion.div>

        {/* --- Right side: Form --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="text-zinc-200 font-semibold mb-2 flex items-center gap-2">
            <Terminal size={16} className="text-teal-400" />
            Send a Message
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 text-sm text-zinc-300"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Your Message"
              required
              value={form.message}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
            />

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-teal-500 hover:to-emerald-500 transition-all"
            >
              <Send size={14} />
              Send Message
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-2 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-teal-400" />
              Based in <span className="text-zinc-300">Sunyani, Ghana</span>
            </div>
            <div className="text-zinc-500 mt-1">
              Let’s collaborate on DevOps automation, cloud projects, or Flutter deployments
              <Rocket size={12} className="inline-block ml-1 text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Pop-up */}
      <AnimatePresence>
        {sent && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-teal-700 rounded-2xl p-6 text-center max-w-sm w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CheckCircle2 size={48} className="text-teal-400 mx-auto mb-3" />
              <h3 className="text-zinc-100 font-semibold text-lg mb-1">
                Message Sent Successfully!
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Thank you for reaching out. I’ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSent(false)}
                className="flex items-center gap-1 mx-auto text-xs bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-teal-500 hover:to-emerald-500 transition-all"
              >
                <X size={12} /> Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3 text-center text-xs text-zinc-500 font-mono">
        <span className="text-emerald-400">[KobbyOps API 2.0]</span> — Monitoring new connections at
        <span className="text-teal-400"> /api/contact</span>
      </div>
    </div>
  );
}
