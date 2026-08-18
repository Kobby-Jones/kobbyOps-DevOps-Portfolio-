import Footer from "@/components/site/Footer";
import HeroVantaController from "@/components/site/HeroVantaController";
import Navbar from "@/components/site/Navbar";
import PageViewTracker from "@/components/site/PageViewTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <PageViewTracker />
      <HeroVantaController />
    </div>
  );
}
