import Topbar from "@/components/layout/Topbar";
import Contact from "@/components/panels/Contact";

export const metadata = {
  title: "Contact | KobbyOps",
  description:
    "Get in touch with Cobbina Emmanuel (Kobby Jones), DevOps Engineer and cloud developer.",
};

export default function ContactPage() {
    
  return(
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-100">
         <Topbar />
      <div className="flex items-center gap-4 bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
      <img
        src="/images/profile.jpeg"
        alt="Cobbina Emmanuel"
        className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover"
      />
      <div>
        <h2 className="text-zinc-100 font-semibold text-lg">Cobbina Emmanuel</h2>
        <p className="text-sm text-zinc-400">
          DevOps Engineer • Cloud Automation • CI/CD • AWS
        </p>
      </div>
    </div>
    <Contact />
    </div>
   
  )
   
}
