import type { Metadata } from "next";
import AdminConsole from "@/components/admin/AdminConsole";
import AdminLogin from "@/components/admin/AdminLogin";
import { adminAuthConfigured, isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  return authenticated ? <AdminConsole /> : <AdminLogin configured={adminAuthConfigured()} />;
}
