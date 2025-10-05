"use client";
import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const data = {
    status: "online",
    message: "Thanks for connecting!",
    email: "kobbyj099@gmail.com",
    github: "https://github.com/Kobby-Jones",
    linkedin: "https://linkedin.com/in/kobby-jones",
    region: "Africa/Accra",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-zinc-300 font-medium mb-2">📞 Contact API</h2>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-400 text-sm mb-2">
          GET <span className="text-emerald-400">/api/contact</span> → 200 OK
        </div>

        <pre className="font-mono text-sm text-teal-300 bg-black/50 rounded-xl p-3 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg transition"
          >
            {copied ? "Copied!" : "Copy Email"}
          </button>

          <a
            href={`mailto:${data.email}`}
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition"
          >
            Send Email
          </a>

          <a
            href={data.github}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition"
          >
            GitHub ↗
          </a>

          <a
            href={data.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3 text-center">
        <div className="text-xs text-zinc-500 font-mono">
          <span className="text-emerald-400">[KobbyOps v2.0]</span> — Always
          deploying excellence 🚀
        </div>
      </div>
    </div>
  );
}
