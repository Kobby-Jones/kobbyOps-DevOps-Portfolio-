"use client";
import { useEffect, useState } from "react";

// helper function for simulating level changes
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function Skills() {
  const [skills, setSkills] = useState([
    { name: "Docker", level: 95, status: "Stable" },
    { name: "Kubernetes", level: 90, status: "Healthy" },
    { name: "Jenkins / CI", level: 85, status: "Running" },
    { name: "AWS", level: 78, status: "Scaling" },
    { name: "Terraform", level: 70, status: "Active" },
    { name: "Linux", level: 92, status: "Solid" },
  ]);

  // Simulate live skill "load" variation
  useEffect(() => {
    const interval = setInterval(() => {
      setSkills((prev) =>
        prev.map((s) => ({
          ...s,
          level: Math.min(100, Math.max(60, s.level + rand(-2, 2))),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const Progress = ({ value }: { value: number }) => (
    <div className="w-full h-2 bg-zinc-800 rounded-full">
      <div
        className="h-2 bg-teal-400 rounded-full transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="space-y-3">
      <h2 className="text-zinc-300 font-medium mb-4">Core DevOps Skills</h2>
      {skills.map((sk) => (
        <div
          key={sk.name}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="text-zinc-200 font-medium">{sk.name}</div>
            <div className="text-xs text-zinc-400">{sk.status}</div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={sk.level} />
            <div className="text-zinc-400 text-sm w-12 text-right">
              {sk.level}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
