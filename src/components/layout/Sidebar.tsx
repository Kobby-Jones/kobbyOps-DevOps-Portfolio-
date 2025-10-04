"use client";
import React from "react";

interface Props {
  currentTab: string;
  setTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setTab }: Props) {
  const items = [
    { id: "overview", label: "Overview", emoji: "🧠" },
    { id: "skills", label: "Skills", emoji: "🧰" },
    { id: "projects", label: "Projects", emoji: "☁️" },
    { id: "deployments", label: "Deployments", emoji: "🚀" },
    { id: "logs", label: "Logs", emoji: "📜" },
    { id: "contact", label: "Contact", emoji: "📞" },
  ];

  return (
    <aside className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3 h-fit">
      <div className="text-zinc-400 text-xs mb-2">Navigation</div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          className={`w-full text-left px-3 py-2 rounded-xl mb-1 transition hover:bg-zinc-800/60 ${
            currentTab === item.id
              ? "bg-zinc-800 text-teal-300"
              : "text-zinc-300"
          }`}
        >
          <span className="mr-2">{item.emoji}</span>
          {item.label}
        </button>
      ))}
    </aside>
  );
}
