import { ChevronDown, Play, Star } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

export function Hero({ settings }: { settings: SiteSettings }) {
  const h = (settings.hero ?? {}) as Record<string, unknown>;
  const stats = (h.stats ?? []) as Array<{ label: string; value: string }>;
  const ratedText = (h.rated_text as string) || "Rated by 5,000+ travelers";
  const footerText =
    (h.footer_text as string) || "Government-licensed · Sherpa-led · 100% local team";

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-primary"
    >
      {/* Background loop video */}
      {h.video_url && (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={h.video_url} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 pt-32 pb-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {h.badge && (
            <div className="inline-flex animate-fade-in items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {h.badge}
            </div>
          )}

          <h1 className="mt-7 animate-fade-up font-display text-5xl font-medium leading-[1.02] text-white sm:text-6xl lg:text-[clamp(3.5rem,7vw,6.5rem)]">
            {h.title_pre ?? "Explore Nepal Beyond"}
            <br />
            <span className="text-gradient-accent italic">
              {h.title_highlight ?? "The Ordinary"}
            </span>
          </h1>

          <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-white/80 [animation-delay:120ms]">
            {h.subtitle}
          </p>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:240ms]">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full btn-hero px-7 py-4 text-sm font-semibold"
            >
              {h.cta_primary ?? "Start Your Journey"}
            </a>
            <a
              href="#adventures"
              className="inline-flex items-center gap-3 rounded-full btn-ghost-white px-6 py-4 text-sm font-semibold"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-primary">
                <Play className="h-3 w-3 fill-current" />
              </span>
              {h.cta_secondary ?? "Watch Our Story"}
            </a>
          </div>
        </div>

        {/* Floating stats card */}
        <div className="lg:col-span-5">
          <div className="animate-float-slow mx-auto max-w-md rounded-3xl glass p-7 text-white shadow-glass [animation-delay:300ms]">
            <div className="flex items-center gap-2 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm font-medium text-white/85">{ratedText}</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-y-7">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="font-display text-3xl font-medium leading-none">{s.value}</div>
                  <div className="mt-1.5 text-xs uppercase tracking-wider text-white/65">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 border-t border-white/10 pt-5 text-xs text-white/60">
              {footerText}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#adventures"
        aria-label="Scroll"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-scroll-bounce" />
      </a>
    </section>
  );
}
