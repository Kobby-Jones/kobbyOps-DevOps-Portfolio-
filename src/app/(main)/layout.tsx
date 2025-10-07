import Sidebar from "@/components/layout/Sidebar";
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[220px_1fr] gap-6">
        <Sidebar />
        <div className="space-y-6">
          {/* 🔹 Top Profile Bar */}
          <div className="flex items-center gap-4 bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
            <img
              src="/images/profile.jpeg"
              alt="Cobbina Emmanuel"
              className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover"
            />
            <div>
              <h2 className="text-zinc-100 font-semibold text-lg">
                Cobbina Emmanuel
              </h2>
              <p className="text-sm text-zinc-400">
                DevOps Engineer • Cloud Automation • CI/CD • AWS
              </p>
            </div>
          </div>

          {/* 🔹 Main Page Content */}
          <main className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
