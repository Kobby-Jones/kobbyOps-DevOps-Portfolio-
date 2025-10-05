"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react"; // for nice icon (if using lucide-react)

interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  details: string[];
}

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/experience.json")
      .then((res) => res.json())
      .then((data) => {
        setExperience(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-zinc-400 text-sm">Loading experience...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-zinc-300 font-medium">🧭 Experience Timeline</h2>

        {/* Resume Download Button */}
        <a
        href="https://drive.google.com/file/d/1UAjNzUpMr_TmV--X05X1-cB3vfzHlZF5/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg hover:from-teal-500 hover:to-emerald-500 transition-all flex items-center gap-1"
        >
        <Download size={14} />
        View Résumé
        </a>

      </div>

      <div className="relative pl-4 border-l border-zinc-800">
        {experience.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(39,39,42,0.5)" }}
            className="mb-8 rounded-xl p-4 transition-all border border-zinc-800 hover:border-teal-700/50 hover:shadow-[0_0_15px_-5px_rgba(20,184,166,0.3)]"
          >
            {/* timeline dot */}
            <div className="absolute -left-[7px] top-6 w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 shadow-md" />

            <div className="ml-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="text-zinc-100 font-semibold text-base">
                  {exp.role}
                </div>
                <div className="text-xs text-zinc-500">{exp.period}</div>
              </div>

              <div className="text-sm text-teal-400 font-medium mt-1">
                {exp.organization}
              </div>

              <ul className="list-disc list-inside mt-2 text-zinc-400 text-sm space-y-1">
                {exp.details.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-xs text-zinc-500 text-center mt-6">
        Data loaded from <span className="text-teal-400">/data/experience.json</span>
      </div>
    </div>
  );
}
