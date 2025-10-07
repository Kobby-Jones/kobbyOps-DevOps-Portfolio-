import Dashboard from "@/components/panels/Dashboard";

export const metadata = {
  title: "Dashboard | KobbyOps",
  description:
    "Real-time DevOps dashboard visualizing GitHub commits, CI/CD workflows, and system performance.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
