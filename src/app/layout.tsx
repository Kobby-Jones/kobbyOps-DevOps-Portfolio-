import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KobbyOps — DevOps Portfolio",
  description:
    "Dynamic DevOps engineer portfolio by Cobbina Emmanuel. Automating CI/CD pipelines, deploying scalable apps, and building cloud-native systems.",
  keywords: [
    "Kobby Jones",
    "Cobbina Emmanuel",
    "DevOps Engineer",
    "AWS",
    "Kubernetes",
    "CI/CD",
    "Docker",
    "GitHub Actions",
    "Flutter Developer",
    "Cloud Engineer",
    "Next.js Portfolio"
  ],
  authors: [{ name: "Cobbina Emmanuel" }],
  openGraph: {
    title: "KobbyOps — DevOps Portfolio",
    description:
      "Dynamic DevOps dashboard portfolio built with Next.js, Tailwind, and Framer Motion.",
    url: "https://kobbyops.vercel.app",
    siteName: "KobbyOps",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KobbyOps DevOps Dashboard Preview"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  icons: {
    icon: "/favicon.ico"
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="WVXlk-JsV5IusPZN6Oxl2DJUqMToH94r1Mo_UlthJ_k" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
