"use client";
import { useState } from "react";
import Topbar from "./layout/Topbar";
import Sidebar from "./layout/Sidebar";
import Overview from "./panels/Overview";
import Skills from "./panels/Skills";
import Projects from "./panels/Projects";
import Deployments from "./panels/Deployments";
import Logs from "./panels/Logs";
import Contact from "./panels/Contact";
import Experience from "./panels/Experience";
import RightSidebar from "./layout/RightSidebar";
import GithubPanel from "./panels/Github";
import Dashboard from "./panels/Dashboard";

export default function KobbyOpsDashboard() {
  const [tab, setTab] = useState("overview");

  const renderPanel = () => {
    switch (tab) {
      case "overview": return <Overview />;
      case "skills": return <Skills />;
      case "projects": return <Projects />;
      case "deployments": return <Deployments />;
      case "logs": return <Logs />;
      case "contact": return <Contact />;
      case "experience": return <Experience />;
      case "github": return <GithubPanel />;
      case "dashboard": return <Dashboard />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-100">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6">
        <Sidebar currentTab={tab} setTab={setTab} />
        <main className="space-y-6">{renderPanel()}</main>
        {/* Right widgets */}
    <aside className="hidden lg:block">
    <RightSidebar />
    </aside>

      </div>
      <footer className="max-w-7xl mx-auto px-4 pb-10 text-xs text-zinc-500">
        <div className="border-t border-zinc-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Kobby-Jones — Crafted with React & Tailwind.</div>
          <div className="space-x-3">
            <a href="https://github.com/Kobby-Jones" target="_blank" rel="noreferrer" className="hover:text-teal-300">GitHub</a>
            <a href="#" className="hover:text-teal-300">LinkedIn</a>
            <a href="#" className="hover:text-teal-300">Resume</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
