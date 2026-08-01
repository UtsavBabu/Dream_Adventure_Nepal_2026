import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";
import { useIsMobile } from "@/hooks/use-mobile";

export function Hero({ settings }: { settings: SiteSettings }) {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReducedMotion(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  const showVideo = !isMobile && !reducedMotion;

  const h = (settings.hero ?? {}) as Record<string, unknown>;
  const posterUrl = h.poster_url as string | undefined;
  const titlePre = (h.title_pre as string) || "Explore Nepal Beyond";
  const titleHighlight = (h.title_highlight as string) || "The Ordinary";
  const subtitle =
    (h.subtitle as string) ||
    "Breathtaking treks, mountain expeditions and cultural journeys crafted by local experts.";
  const ctaPrimary = (h.cta_primary as string) || "Start Your Journey";

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background video / poster */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover [object-position:70%_center]"
        />
      )}
      {showVideo && h.video_url && (
        <video
          className="anim-fade absolute inset-0 h-full w-full object-cover [object-position:70%_center]"
          style={{ animationDelay: "0.2s" }}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={posterUrl}
        >
          <source src={h.video_url as string} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />

      {/* Content — badge + heading up top, paragraph + CTA at the bottom */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-12 pt-28 sm:pb-16 sm:pt-32 md:px-12 md:pb-20 lg:px-16">
        {/* Top */}
        <div className="max-w-3xl">
          <div
            className="anim-stagger mb-5 inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-caption font-medium uppercase tracking-[0.2em] text-white/90"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Himalayan Treks · Expeditions · Cultural Tours
          </div>
          <h1
            className="anim-stagger font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.4s", textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
          >
            {titlePre}
            <br />
            <span className="italic text-accent">{titleHighlight}</span>
          </h1>
        </div>

        {/* Bottom */}
        <div className="max-w-3xl">
          <p
            className="anim-stagger mb-6 max-w-lg whitespace-pre-line text-base leading-relaxed text-white/70 md:text-lg"
            style={{ animationDelay: "0.7s" }}
          >
            {subtitle}
          </p>
          <div
            className="anim-stagger flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.9s" }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              {ctaPrimary} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#adventures"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Explore Adventures
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
