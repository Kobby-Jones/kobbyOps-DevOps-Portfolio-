import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cobbina Emmanuel · Software & Cloud Engineer",
    short_name: "KobbyOps",
    description: "Portfolio, projects, writing, and engineering insights by Cobbina Emmanuel.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#14b8a6",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
