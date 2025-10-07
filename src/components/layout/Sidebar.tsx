// "use client";
// import React from "react";
// import {
//   Wrench,
//   Cloud,
//   Rocket,
//   FileText,
//   PhoneCall,
//   Briefcase,
//   Brain,
//   Github as GithubIcon,
//   Activity,
// } from "lucide-react";

// interface Props {
//   currentTab: string;
//   setTab: (tab: string) => void;
// }

// export default function Sidebar({ currentTab, setTab }: Props) {
//   const items = [
//     { id: "overview", label: "Overview", icon: <Brain size={14} className="text-teal-400" /> },
//     { id: "skills", label: "Skills", icon: <Wrench size={14} className="text-teal-400" /> },
//     { id: "projects", label: "Projects", icon: <Cloud size={14} className="text-teal-400" /> },
//     { id: "deployments", label: "Deployments", icon: <Rocket size={14} className="text-teal-400" /> },
//     { id: "logs", label: "Logs", icon: <FileText size={14} className="text-teal-400" /> },
//     { id: "contact", label: "Contact", icon: <PhoneCall size={14} className="text-teal-400" /> },
//     { id: "experience", label: "Experience", icon: <Briefcase size={14} className="text-teal-400" /> },
//     { id: "github", label: "GitHub", icon: <GithubIcon size={14} className="text-teal-400" /> },
//     { id: "dashboard", label: "Dashboard", icon: <Activity size={16} className="inline text-teal-400" /> },

//   ];

//   return (
//     <aside className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3 h-fit shadow-lg">
//       <div className="text-zinc-400 text-xs mb-3 tracking-wide uppercase font-medium">
//         Navigation
//       </div>

//       {items.map((item) => (
//         <button
//           key={item.id}
//           onClick={() => setTab(item.id)}
//           className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl mb-1 transition-all duration-200 hover:bg-zinc-800/60 ${
//             currentTab === item.id
//               ? "bg-zinc-800 text-teal-300 font-medium shadow-inner"
//               : "text-zinc-300 hover:text-teal-200"
//           }`}
//         >
//           {item.icon}
//           <span className="text-sm">{item.label}</span>
//         </button>
//       ))}
//     </aside>
//   );
// }


"use client";
import Link from "next/link";
import { 
  Activity,
   Rocket, 
   FileText, 
   Briefcase, 
   Wrench,
    Cloud,
    Brain,
    Github as GithubIcon,
    PhoneCall,

  } from "lucide-react";

const items = [
  { href: "/", label: "Overview", icon: <Brain size={16} /> },
  { href: "/skills", label: "Skills", icon: <Wrench size={16} /> },
  { href: "/projects", label: "Projects", icon: <Cloud size={16} /> },
  { href: "/dashboard", label: "Dashboard", icon: <Activity size={16} /> },
  { href: "/deployments", label: "Deployments", icon: <Rocket size={16} /> },
  { href: "/logs", label: "Logs", icon: <FileText size={16} /> },
  { href: "/experience", label: "Experience", icon: <Briefcase size={16} /> },
  { href: "/contact", label: "Contact", icon: <PhoneCall size={16} /> },
  {href: "/github", label: "GitHub", icon: <GithubIcon size={16} /> },
];

export default function Sidebar() {
  return (
    <aside className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3 h-fit">
      <div className="text-zinc-400 text-xs mb-2">Navigation</div>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1 transition hover:bg-zinc-800/60 text-zinc-300 hover:text-teal-300"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
