"use client";
import { useEffect, useState } from "react";

interface Skill {
  name: string;
  level: number;
  status: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

export default function Skills() {
  const [skillGroups, setSkillGroups] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/skills.json")
      .then((res) => res.json())
      .then((data) => {
        setSkillGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load skills.json", err);
        setLoading(false);
      });
  }, []);

  const Progress = ({ value }: { value: number }) => (
    <div className="w-full h-2 bg-zinc-800 rounded-full">
      <div
        className="h-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 rounded-full transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="text-zinc-400 text-sm">Loading skills...</div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-zinc-300 font-medium mb-4">🧰 Core Skills</h2>

      {skillGroups.map((group, i) => (
        <div
          key={i}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4"
        >
          <div className="text-zinc-200 font-semibold mb-3 border-b border-zinc-800 pb-1">
            {group.category}
          </div>

          <div className="space-y-3">
            {group.skills.map((sk, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-300 text-sm">{sk.name}</div>
                  <div className="text-xs text-zinc-500">{sk.status}</div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Progress value={sk.level} />
                  <div className="text-zinc-400 text-sm w-12 text-right">
                    {sk.level}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-xs text-zinc-500 text-center mt-4">
        Data loaded from <span className="text-teal-400">/data/skills.json</span>
      </div>
    </div>
  );
}
