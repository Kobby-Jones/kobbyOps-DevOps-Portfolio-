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
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
