import Deployments from "@/components/panels/Deployments";

export const metadata = {
  title: "Deployments | KobbyOps",
  description:
    "Live CI/CD deployment monitor showing automated pipelines, workflow status, and logs.",
};

export default function DeploymentsPage() {
  return <Deployments />;
}
