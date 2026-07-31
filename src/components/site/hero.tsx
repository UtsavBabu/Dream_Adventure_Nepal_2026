import { useEffect, useState } from "react";
import { ChevronDown, Play, ShieldCheck, Star } from "lucide-react";
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
  // Never stream the (4K) background video on phones or for reduced-motion users —
  // the poster image stands in, protecting LCP and mobile data.
  const showVideo = !isMobile && !reducedMotion;

  const h = (settings.hero ?? {}) as Record<string, unknown>;
  const stats = (h.stats ?? []) as Array<{ label: string; value: string }>;
  const ratedText = (h.rated_text as string) || "Rated by 100+ travelers";
  const footerText =
    (h.footer_text as string) || "Government-licensed · Sherpa-led · 100% local team";
  const posterUrl = h.poster_url as string | undefined;
  const cues = footerText
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-primary"
    >
      {/* Cinematic background: video over poster */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      {showVideo && h.video_url && (
        <video
          className="absolute inset-0 -z-10 h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={posterUrl}
        >
          <source src={h.video_url as string} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative mx-auto grid w-full max-w-content gap-12 px-6 pt-36 pb-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          {h.badge && (
            <div className="inline-flex animate-fade-in items-center gap-2.5 rounded-full glass px-4 py-2 text-caption font-medium uppercase tracking-[0.16em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {h.badge as string}
            </div>
          )}

          <h1 className="mt-8 animate-fade-up text-balance font-display text-display font-medium text-white">
            {(h.title_pre as string) ?? "Explore Nepal Beyond"}{" "}
            <span className="text-gradient-accent italic">
              {(h.title_highlight as string) ?? "The Ordinary"}
            </span>
          </h1>

          <p className="mt-7 max-w-xl animate-fade-up whitespace-pre-line text-subtitle leading-relaxed text-white/80 [animation-delay:120ms]">
            {h.subtitle as string}
          </p>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:240ms]">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full btn-primary px-8 py-4 text-small font-semibold"
            >
              {(h.cta_primary as string) ?? "Book Adventure"}
            </a>
            <a
              href="#adventures"
              className="inline-flex items-center gap-3 rounded-full btn-ghost-white px-6 py-4 text-small font-semibold"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-primary">
                <Play className="h-3 w-3 fill-current" />
              </span>
              {(h.cta_secondary as string) ?? "Watch Journey"}
            </a>
          </div>

          {/* Trust cues */}
          {cues.length > 0 && (
            <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-2 text-caption text-white/70 [animation-delay:360ms]">
              {cues.map((c) => (
                <span key={c} className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Floating trust card */}
        <div className="lg:col-span-5">
          <div className="animate-float-slow mx-auto max-w-md rounded-3xl glass p-8 text-white shadow-glass [animation-delay:300ms]">
            <div className="flex items-center gap-2 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-small font-medium text-white/85">{ratedText}</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-display text-h3 font-medium leading-none">{s.value}</div>
                  <div className="mt-2 text-caption uppercase tracking-wider text-white/65">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#adventures"
        aria-label="Scroll to explore"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-scroll-bounce" />
      </a>
    </section>
  );
}
