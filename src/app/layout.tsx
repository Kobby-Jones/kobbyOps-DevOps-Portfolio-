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
    "Kobby Jones | Cloud & DevOps Engineer — Automating CI/CD pipelines, deploying scalable applications, and building cloud-native solutions.",
  icons: {
    icon: "/favicon.ico",
  },
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
        alt: "KobbyOps Dashboard Preview",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
