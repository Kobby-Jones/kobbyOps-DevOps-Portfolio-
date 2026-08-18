"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type VantaEffect = {
  destroy: () => void;
};

type VantaFactory = (options: Record<string, unknown>) => VantaEffect;

const STATIC_HERO_PREFIXES = ["/order", "/privacy"];
const HERO_SELECTOR = "main .hero-section, main .page-hero";

export default function HeroVantaController() {
  const pathname = usePathname();

  useEffect(() => {
    if (STATIC_HERO_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;

    const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");

    let effect: VantaEffect | null = null;
    let cancelled = false;
    let initializing = false;

    const setFallback = () => {
      hero.classList.remove("vanta-hero-active");
      hero.classList.add("vanta-hero-fallback");
    };

    const destroyEffect = () => {
      effect?.destroy();
      effect = null;
      hero.classList.remove("vanta-hero-active");
    };

    const initialize = async () => {
      if (initializing || effect || reducedMotion.matches || cancelled) {
        if (reducedMotion.matches) setFallback();
        return;
      }

      initializing = true;

      try {
        const [threeModule, wavesModule] = await Promise.all([
          import("three"),
          import("vanta/dist/vanta.waves.min"),
        ]);

        if (cancelled || reducedMotion.matches) {
          setFallback();
          return;
        }

        const WAVES = (
          wavesModule.default ?? wavesModule
        ) as unknown as VantaFactory;

        const isMobile = mobileViewport.matches;

        effect = WAVES({
          el: hero,
          THREE: threeModule,

          mouseControls: false,
          touchControls: false,
          gyroControls: false,

          minHeight: 200,
          minWidth: 200,

          scale: 1,
          scaleMobile: 1,

          backgroundColor: 0x09090b,
          backgroundAlpha: 0,

          color: 0x0f766e,

          shininess: 35,
          waveHeight: isMobile ? 8 : 14,
          waveSpeed: 0.5,
          zoom: isMobile ? 0.8 : 0.9,
        });

        hero.classList.remove("vanta-hero-fallback");
        hero.classList.add("vanta-hero-active");
      } catch (error) {
        // A static branded hero remains in place if WebGL/Vanta is unavailable.
        console.warn("Vanta hero background could not be initialized.", error);
        setFallback();
      } finally {
        initializing = false;
      }
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        destroyEffect();
        setFallback();
      } else {
        hero.classList.remove("vanta-hero-fallback");
        void initialize();
      }
    };

    void initialize();

    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      cancelled = true;
      reducedMotion.removeEventListener("change", handleMotionPreference);
      destroyEffect();
      hero.classList.remove("vanta-hero-fallback");
    };
  }, [pathname]);

  return null;
}