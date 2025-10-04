"use client";
import { useEffect, useRef, useState } from "react";

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

type Outcome = "success" | "failed";

export default function Deployments() {
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [buildStart, setBuildStart] = useState<number | null>(null);
  const [buildDuration, setBuildDuration] = useState<number>(0);
  const [autoRedeploy, setAutoRedeploy] = useState(false);
  const tailRef = useRef<HTMLDivElement | null>(null);

  // --- simulation controls ---
  const startDeployment = () => {
    setLogs([]);
    setProgress(0);
    setActiveStage(0);
    setOutcome(null);
    setBuildStart(Date.now());
    setBuildDuration(0);
  };

  const restartOnSuccess = () => {
    if (autoRedeploy) {
      setTimeout(() => startDeployment(), 3000);
    }
  };

  // progress simulation
  useEffect(() => {
    if (outcome !== null) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + rand(2, 8);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [outcome]);

  // stage update + completion
  useEffect(() => {
    if (progress >= (activeStage + 1) * 20 && activeStage < 4) {
      setActiveStage((s) => s + 1);
      setLogs((prev) => [
        `${nowFmt()}  ✅ Stage '${pipelineStages[activeStage]}' completed.`,
        ...prev,
      ]);
    }
    if (progress >= 100 && outcome === null) {
      // Random outcome
      const didFail = Math.random() < 0.2; // 20% chance of failure
      const result: Outcome = didFail ? "failed" : "success";
      setOutcome(result);
      setBuildDuration(
        buildStart ? Math.floor((Date.now() - buildStart) / 1000) : 0
      );
      setLogs((l) => [
        `${nowFmt()}  ${
          didFail
            ? "❌ Deployment failed — reason: timeout in container startup."
            : "✅ Deployment succeeded — all systems operational."
        }`,
        ...l,
      ]);
    }
  }, [progress]);

  // live log generation
  useEffect(() => {
    if (outcome !== null) return;
    const t = setInterval(() => {
      const samples = [
        `⚙️  Pulling latest commit... (${rand(4, 8)}s)`,
        `🐳  Building Docker image... layer ${rand(1, 5)}/5`,
        `🧪  Running test suite... ${rand(98, 100)}% passed.`,
        `📦  Packaging artifacts...`,
        `🚀  Deploying to prod environment...`,
        `🔍  Health check: ${rand(95, 100)}% passed.`,
        `📡  Updating load balancer routes...`,
        `🔒  Validating SSL cert... OK.`,
      ];
      const randomLog = samples[rand(0, samples.length - 1)];
      setLogs((l) => [`${nowFmt()}  ${randomLog}`, ...l]);
    }, 1800);
    return () => clearInterval(t);
  }, [outcome]);

  // auto scroll
  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // auto redeploy trigger
  useEffect(() => {
    if (outcome === "success") restartOnSuccess();
  }, [outcome]);

  // build time counter
  useEffect(() => {
    if (!buildStart || outcome) return;
    const timer = setInterval(() => {
      setBuildDuration(Math.floor((Date.now() - buildStart) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [buildStart, outcome]);

  const Progress = ({ value }: { value: number }) => (
    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className={`h-2 ${
          outcome === "failed"
            ? "bg-gradient-to-r from-rose-500 to-red-600"
            : "bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"
        } animate-pulse`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );

  // --- Render ---
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-zinc-300 font-medium">🚀 Live CI/CD Pipeline</h2>
        <div className="flex items-center gap-3">
          <label className="text-xs text-zinc-500 flex items-center gap-1">
            <input
              type="checkbox"
              checked={autoRedeploy}
              onChange={(e) => setAutoRedeploy(e.target.checked)}
            />
            Auto-Redeploy
          </label>
          <button
            onClick={startDeployment}
            className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg transition"
          >
            Redeploy
          </button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="font-medium text-zinc-200">
            portfolio@main — CI Runner #{rand(10, 99)}
          </div>
          <div className="text-xs text-zinc-500">
            Duration: {buildDuration}s
          </div>
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
          {outcome === null && <>⏳ Pipeline running... stand by.</>}
          {outcome === "success" && (
            <span className="text-emerald-400">✅ Deployment successful.</span>
          )}
          {outcome === "failed" && (
            <span className="text-rose-400">❌ Pipeline failed.</span>
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
            <div
              key={idx}
              className={`whitespace-pre ${
                line.includes("❌")
                  ? "text-rose-400"
                  : line.includes("✅")
                  ? "text-emerald-400"
                  : line.includes("⚙️") ||
                    line.includes("🐳") ||
                    line.includes("🚀")
                  ? "text-sky-400"
                  : "text-zinc-300"
              }`}
            >
              {line}
            </div>
          ))}
          <div ref={tailRef} />
        </div>
      </div>

      {/* Deployment Summary */}
      {outcome && (
        <div
          className={`rounded-2xl p-4 text-center ${
            outcome === "success"
              ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-600/30"
              : "bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-600/30"
          }`}
        >
          {outcome === "success" ? (
            <>
              <div className="text-emerald-400 font-semibold text-lg">
                ✅ Deployment Succeeded
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Version <span className="text-zinc-200">v2.{rand(1, 9)}.{rand(0, 9)}</span>{" "}
                deployed in {buildDuration}s — all systems operational.
              </div>
            </>
          ) : (
            <>
              <div className="text-rose-400 font-semibold text-lg">
                ❌ Deployment Failed
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Rolled back to stable version v2.{rand(0, 8)}.{rand(0, 9)}.  
                Issue logged for review.
              </div>
            </>
          )}
          <div className="text-xs text-zinc-500 mt-1">
            Triggered by Kobby-Jones · Branch: main
          </div>
        </div>
      )}
    </div>
  );
}
