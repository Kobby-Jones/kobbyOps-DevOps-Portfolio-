import Logs from "@/components/panels/Logs";

export const metadata = {
  title: "System Logs | KobbyOps",
  description:
    "Real-time system logs displaying GitHub push, workflow, and deployment events.",
};

export default function LogsPage() {
  return <Logs />;
}
