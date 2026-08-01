import { useEffect, useState } from "react";
import { ArrowRight, Instagram, Facebook, MessageCircle } from "lucide-react";
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
  const nav = (settings.nav ?? {}) as { logo?: string };
  const social = (settings.social ?? {}) as { instagram?: string; facebook?: string };
  const contact = (settings.contact ?? {}) as { phone?: string; whatsapp?: string };
  const posterUrl = h.poster_url as string | undefined;

  const titlePre = (h.title_pre as string) || "Explore Nepal Beyond";
  const titleHighlight = (h.title_highlight as string) || "The Ordinary";
  const brand = nav.logo || "Dream Adventure Nepal";
  const subtitle =
    (h.subtitle as string) ||
    "Breathtaking treks, mountain expeditions and cultural journeys crafted by local experts.";
  const ctaPrimary = (h.cta_primary as string) || "Start Your Journey";

  const waNumber =
    contact.whatsapp && !/0{6,}/.test(contact.whatsapp) ? contact.whatsapp : contact.phone;
  const waUrl = waNumber
    ? `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hi! I'd like to plan a trip with Dream Adventure Nepal.",
      )}`
    : undefined;

  return (
    <section id="home" className="min-h-screen w-full bg-black p-3 md:p-4">
      <div className="relative flex h-[calc(100vh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl bg-black md:h-[calc(100vh-2rem)]">
        {/* Background video / poster */}
        {posterUrl && (
          <img src={posterUrl} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        )}
        {showVideo && h.video_url && (
          <video
            className="anim-fade absolute inset-0 h-full w-full object-cover"
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

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between px-6 pb-8 pt-28 md:px-10 md:pb-10 md:pt-32">
          {/* Top: left tagline + center heading */}
          <div className="relative flex flex-1 items-center">
            {/* Left column */}
            <div
              className="anim-stagger absolute left-0 top-[18%] hidden flex-col gap-6 lg:flex"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="max-w-[220px] text-base leading-relaxed text-white/80">
                Come walk with us
                <br />
                into the
                <br />
                Himalaya
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-4 w-4 rounded-full border border-white/40" />
                  <span className="h-4 w-4 rounded-full border border-white/40" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-white/70">
                    Perpetual
                    <br />
                    Adventure
                  </span>
                  <span className="text-xs text-white/50">01</span>
                </div>
              </div>
            </div>

            {/* Center heading */}
            <div className="anim-stagger w-full text-center" style={{ animationDelay: "0.5s" }}>
              <h1
                className="font-display text-3xl font-normal leading-[1.1] tracking-[-0.04em] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.25)" }}
              >
                {titlePre}
                <br />
                <span className="italic text-accent">{titleHighlight}</span>
                <br />
                {brand}
              </h1>
            </div>
          </div>

          {/* Bottom 3-column row */}
          <div className="mt-8 grid grid-cols-1 items-center gap-6 md:grid-cols-3">
            {/* Col 1 — description */}
            <div
              className="anim-stagger flex items-center justify-center md:justify-end"
              style={{ animationDelay: "0.7s" }}
            >
              <p className="max-w-[260px] whitespace-pre-line text-center text-sm leading-relaxed text-white md:ml-auto md:text-left">
                {subtitle}
              </p>
            </div>

            {/* Col 2 — label + primary CTA */}
            <div
              className="anim-stagger flex flex-col items-center gap-8 md:gap-24"
              style={{ animationDelay: "0.85s" }}
            >
              <span className="text-2xl font-medium text-white md:text-3xl">
                Trusted since 2005
              </span>
              <a
                href="#contact"
                className="btn-cut group flex w-full max-w-[280px] items-center justify-center gap-2 bg-white py-3.5 text-black transition-colors hover:bg-white/90"
              >
                <span className="text-sm font-medium">{ctaPrimary}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Col 3 — social octagon buttons */}
            <div
              className="anim-stagger flex items-center justify-center gap-3 md:justify-end"
              style={{ animationDelay: "1s" }}
            >
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="btn-cut-sm flex h-10 w-10 items-center justify-center bg-white text-black transition-colors hover:bg-white/90"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="btn-cut-sm flex h-10 w-10 items-center justify-center bg-white text-black transition-colors hover:bg-white/90"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="btn-cut-sm flex h-10 w-10 items-center justify-center bg-white text-black transition-colors hover:bg-white/90"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
