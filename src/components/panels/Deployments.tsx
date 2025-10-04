"use client";
import { useEffect, useRef, useState } from "react";

// Utility helpers
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const nowFmt = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

const pipelineStages = [
  "Fetch Source",
  "Install Dependencies",
  "Run Tests",
  "Build Artifacts",
  "Deploy to Production",
];

export default function Deployments() {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const tailRef = useRef<HTMLDivElement | null>(null);

  // pipeline simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + rand(3, 10);
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // stage update
  useEffect(() => {
    if (progress >= (activeStage + 1) * 20 && activeStage < 4) {
      setActiveStage((s) => s + 1);
      setLogs((prev) => [
        `${nowFmt()}  INFO  Stage '${pipelineStages[activeStage]}' completed successfully.`,
        ...prev,
      ]);
    }
  }, [progress]);

  // live logs
  useEffect(() => {
    const t = setInterval(() => {
      if (progress < 100) {
        const samples = [
          `INFO  Pulling latest commit... (${rand(4, 8)}s)`,
          `INFO  Running test suite... passed ${rand(40, 100)} tests.`,
          `INFO  Docker image built: kobbyops:latest`,
          `INFO  Uploading artifacts to AWS S3...`,
          `INFO  Tagging release: v${rand(1, 5)}.${rand(0, 9)}.${rand(0, 9)}`,
          `INFO  Deploying containers...`,
          `NOTICE Health checks: ${rand(95, 100)}% passed.`,
        ];
        const randomLog = samples[rand(0, samples.length - 1)];
        setLogs((l) => [`${nowFmt()}  ${randomLog}`, ...l]);
      } else {
        setLogs((l) => [
          `${nowFmt()}  ✅ Deployment succeeded — reason: coffee ☕`,
          ...l,
        ]);
        clearInterval(t);
      }
    }, 1800);
    return () => clearInterval(t);
  }, [progress]);

  // scroll tail
  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const Progress = ({ value }: { value: number }) => (
    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 animate-pulse"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-zinc-300 font-medium mb-4">
        🚀 Live CI/CD Pipeline
      </h2>

      {/* Pipeline Summary */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="font-medium text-zinc-200 mb-2">
          portfolio@main — Continuous Deployment
        </div>
        <Progress value={progress} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-3">
          {pipelineStages.map((s, i) => (
            <div
              key={s}
              className={`text-xs flex items-center gap-2 ${
                i <= activeStage
                  ? "text-emerald-400"
                  : "text-zinc-500 opacity-60"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  i <= activeStage ? "bg-emerald-400" : "bg-zinc-700"
                }`}
              />
              {s}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          {progress < 100 ? (
            <>⏳ Pipeline running... please stand by.</>
          ) : (
            <>✅ Deployment completed successfully.</>
          )}
        </div>
      </div>

      {/* Deployment Logs */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="font-medium text-zinc-200 mb-2">
          tail -f /var/log/pipeline.log
        </div>
        <div className="font-mono text-xs text-zinc-300 bg-black/50 rounded-xl p-3 h-80 overflow-auto">
          {[...logs].reverse().map((line, idx) => (
            <div key={idx} className="whitespace-pre">
              {line}
            </div>
          ))}
          <div ref={tailRef} />
        </div>
      </div>

      {/* Deployment Summary */}
      {progress >= 100 && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-600/30 rounded-2xl p-4 text-center">
          <div className="text-emerald-400 font-semibold text-lg">
            ✅ Deployment Succeeded
          </div>
          <div className="text-zinc-400 text-sm mt-1">
            Version <span className="text-zinc-200">v2.0.1</span> deployed in{" "}
            {rand(60, 120)}s — all systems operational.
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Triggered by Kobby-Jones · via CI Runner #12
          </div>
        </div>
      )}
    </div>
  );
}
