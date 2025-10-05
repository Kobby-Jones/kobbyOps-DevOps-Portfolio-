"use client";
import { useEffect, useState } from "react";

const nowFmt = () => new Date().toLocaleString();

export default function Topbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(nowFmt());
    const t = setInterval(() => setTime(nowFmt()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
            <div className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 grid place-content-center font-bold">
              K
            </div>
          </div>
          <div>
            <div className="font-semibold">KobbyOps — DevOps Portfolio</div>
            <div className="text-xs text-zinc-400">
              Monitoring the life, skills, and deployments of Kobby-Jones
            </div>
          </div>
        </div>
        <div className="text-xs text-zinc-400">{time}</div>
      </div>
    </div>
  );
}
