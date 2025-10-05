"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  name: string;
  status: string;
  stack: string;
  uptime: number;
  success_rate: number;
  requests: string;
  repo: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const Progress = ({ value }: { value: number }) => (
    <div className="w-full h-2 bg-zinc-800 rounded-full">
      <div
        className="h-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const extractTags = (stack: string): string[] =>
    stack.split("+").map((s) => s.trim());

  const getCategory = (p: Project) => {
    if (p.stack.includes("AWS")) return "Cloud / DevOps";
    if (p.stack.includes("Flutter")) return "Mobile Apps";
    if (p.stack.includes("React") || p.stack.includes("Next.js"))
      return "Web Apps";
    return "Other";
  };

  const grouped = projects.reduce<Record<string, Project[]>>((acc, proj) => {
    const cat = getCategory(proj);
    acc[cat] = acc[cat] ? [...acc[cat], proj] : [proj];
    return acc;
  }, {});

  const badgeColors = [
    "bg-teal-600/30 text-teal-300 border border-teal-700/50",
    "bg-sky-600/30 text-sky-300 border border-sky-700/50",
    "bg-emerald-600/30 text-emerald-300 border border-emerald-700/50",
    "bg-indigo-600/30 text-indigo-300 border border-indigo-700/50",
    "bg-amber-600/30 text-amber-300 border border-amber-700/50",
    "bg-pink-600/30 text-pink-300 border border-pink-700/50"
  ];

  const randomBadgeColor = () =>
    badgeColors[Math.floor(Math.random() * badgeColors.length)];

  if (loading) return <div className="text-zinc-400 text-sm">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-zinc-300 font-medium">☁️ Projects</h2>

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="space-y-3">
          <div className="text-zinc-200 font-semibold text-lg border-b border-zinc-800 pb-1">
            {category}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 hover:border-teal-600/60 cursor-pointer"
                onClick={() => setSelected(p)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-zinc-100 font-semibold">{p.name}</div>
                    <div className="text-xs text-zinc-500">{p.stack}</div>
                  </div>
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

                <p className="text-zinc-400 text-sm mt-2 line-clamp-3">
                  {p.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {extractTags(p.stack).map((tag, i) => (
                    <span
                      key={i}
                      className={`text-[10px] px-2 py-[2px] rounded-full ${randomBadgeColor()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3">
                  <Progress value={p.success_rate} />
                </div>

                <div className="text-xs text-zinc-500 mt-2">
                  {p.success_rate}% success · {p.uptime} days uptime
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full mx-4 p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-zinc-100">{selected.name}</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-zinc-400 hover:text-zinc-200 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-zinc-500 mb-2">{selected.stack}</div>
              <p className="text-zinc-300 text-sm mb-3">{selected.description}</p>

              {/* Tags inside modal */}
              <div className="flex flex-wrap gap-1 mb-4">
                {extractTags(selected.stack).map((tag, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-2 py-[2px] rounded-full ${randomBadgeColor()}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-zinc-400">Uptime</div>
                  <div className="text-zinc-100">{selected.uptime} days</div>
                </div>
                <div>
                  <div className="text-zinc-400">Success Rate</div>
                  <div className="text-zinc-100">{selected.success_rate}%</div>
                </div>
                <div>
                  <div className="text-zinc-400">Requests</div>
                  <div className="text-zinc-100">{selected.requests}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Status</div>
                  <div
                    className={`text-xs font-semibold ${
                      selected.status === "active"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {selected.status}
                  </div>
                </div>
              </div>

              <a
                href={selected.repo}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-teal-400 text-sm hover:underline"
              >
                View Repository ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs text-zinc-500 text-center mt-6">
        Data loaded from <span className="text-teal-400">/data/projects.json</span>
      </div>
    </div>
  );
}
