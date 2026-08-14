export const siteConfig = {
  name: "Cobbina Emmanuel",
  alternateName: "Kobby Jones",
  brand: "KobbyOps",
  title: "Cobbina Emmanuel | Software & Cloud Engineer",
  description:
    "Cobbina Emmanuel is a Software and Cloud Engineer in Ghana building secure applications, cloud platforms, APIs, CI/CD systems, and production-ready infrastructure.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kobbyops.vercel.app",
  email: "cobbina1.emmanuel@gmail.com",
  phone: "+233598738535",
  location: "Accra, Ghana",
  github: "https://github.com/Kobby-Jones",
  linkedin: "https://www.linkedin.com/in/cobbina-emmanuel",
  resume: "/resume/Cobbina-Emmanuel-CV.pdf",
  locale: "en_GH",
} as const;

export const absoluteUrl = (path = "/") =>
  new URL(path, siteConfig.url).toString();
