"use client";
import React from "react";

// Temporary mock projects — we'll load from JSON later
const projects = [
  {
    id: "prepgo",
    name: "PrepGo",
    status: "active",
    stack: "Flutter + Firebase + Functions",
    uptime: 142,
    success_rate: 99.3,
    requests: "2.3k/d",
    repo: "https://github.com/Kobby-Jones",
    description:
      "An academic revision app for UENR students featuring past questions, AI-powered explanations, and Paystack premium tiers.",
  },
  {
    id: "evote",
    name: "EVote",
    status: "active",
    stack: "Django + DRF + Next.js + MoMo",
    uptime: 88,
    success_rate: 99.0,
    requests: "1.1k/d",
    repo: "https://github.com/Kobby-Jones",
    description:
      "A secure online voting platform with event-based multi-tenant structure and MTN MoMo integration for paid polls.",
  },
  {
    id: "pos-suite",
    name: "POS Suite",
    status: "active",
    stack: "Django + SQLite (offline-first) + Flutter",
    uptime: 210,
    success_rate: 99.7,
    requests: "3.9k/d",
    repo: "https://github.com/Kobby-Jones",
    description:
      "An offline-first multi-business POS (supermarket, pharmacy, restaurant) with advanced analytics and local caching.",
  },
  {
    id: "facevault",
    name: "FaceVault Pro",
    status: "maintenance",
    stack: "Flutter + TensorFlow Lite + Secure Storage",
    uptime: 31,
    success_rate: 98.6,
    requests: "350/d",
    repo: "https://github.com/Kobby-Jones",
    description:
      "A cross-platform privacy app that uses on-device face recognition to lock and unlock apps, files, or sensitive data.",
  },
];

const Progress = ({ value }: { value: number }) => (
  <div className="w-full h-2 bg-zinc-800 rounded-full">
    <div
      className="h-2 bg-teal-400 rounded-full transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function Projects() {
  return (
    <div className="space-y-4">
      <h2 className="text-zinc-300 font-medium mb-4">Active Projects</h2>

      {projects.map((p) => (
        <div
          key={p.id}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 hover:border-teal-700/60 transition-all"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-zinc-100 font-semibold text-lg">{p.name}</div>
              <div className="text-zinc-500 text-sm">{p.stack}</div>
            </div>
            <div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  p.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {p.status}
              </span>
            </div>
          </div>

          <p className="text-zinc-400 text-sm mt-2">{p.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <div className="text-zinc-400">Uptime</div>
              <div className="text-zinc-200 font-medium">{p.uptime} days</div>
            </div>
            <div>
              <div className="text-zinc-400">Success Rate</div>
              <div className="text-zinc-200 font-medium">{p.success_rate}%</div>
            </div>
            <div>
              <div className="text-zinc-400">Daily Requests</div>
              <div className="text-zinc-200 font-medium">{p.requests}</div>
            </div>
            <div>
              <div className="text-zinc-400">Repository</div>
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="text-teal-300 hover:underline"
              >
                View Code ↗
              </a>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={p.success_rate} />
          </div>
        </div>
      ))}
    </div>
  );
}
