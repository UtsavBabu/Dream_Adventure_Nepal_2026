import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { ArrowRight, Clock, Mountain, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Adventure } from "@/lib/site-data";

// Single source of truth for the adventure card used on the homepage,
// the treks/expeditions/tours listings, and anywhere else.
// Pexels URLs accept a ?w= width param — build a srcset so phones don't download
// desktop-sized images. Other hosts (Supabase storage) are served as-is.
function pexelsSrcSet(url?: string) {
  if (!url || !url.includes("images.pexels.com") || !/[?&]w=\d+/.test(url)) return undefined;
  return [400, 600, 800, 1200].map((w) => `${url.replace(/w=\d+/, `w=${w}`)} ${w}w`).join(", ");
}

// Derive the highest altitude quoted in the itinerary/overview (e.g. "5,364 m")
// so the hover panel can surface a real "max elevation" figure. Returns null
// when no credible high-altitude number is present.
function maxAltitude(a: Adventure): string | null {
  const text =
    (a.itinerary ?? []).map((d) => `${d.title} ${d.description}`).join(" ") +
    " " +
    (a.long_description ?? "");
  let max = 0;
  for (const m of text.matchAll(/(\d[\d,]{2,})\s*m\b/g)) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    // Cap at ~6,900 m: higher figures in the copy are 7-8000m peaks you *view*,
    // not altitudes the trek/expedition actually reaches.
    if (n > max && n <= 6900) max = n;
  }
  return max >= 2500 ? max.toLocaleString() : null;
}

function Chip({ icon: Icon, children }: { icon: typeof Clock; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md ring-1 ring-white/20">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {children}
    </span>
  );
}

export function AdventureCard({ adventure: a, label }: { adventure: Adventure; label?: string }) {
  const altitude = maxAltitude(a);
  const ref = useRef<HTMLAnchorElement | null>(null);
  const tiltOn = useRef(false);

  useEffect(() => {
    tiltOn.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Subtle 3D tilt toward the cursor. Written straight to inline style (no
  // re-render); disabled on touch / reduced-motion.
  const onMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el || !tiltOn.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const max = 5.5;
    el.style.transition = "transform 0s";
    el.style.transform = `perspective(1100px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.2,0.8,0.2,1)";
    el.style.transform = "";
  };

  return (
    <Link
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      to="/adventures/$slug"
      params={{ slug: a.slug }}
      style={{ transformStyle: "preserve-3d" }}
      className="group card-elevate block overflow-hidden rounded-3xl bg-white shadow-glass ring-1 ring-black/[0.04] transition-shadow hover:ring-2 hover:ring-accent/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={a.image_url || undefined}
          srcSet={pexelsSrcSet(a.image_url)}
          sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
          alt={a.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.12]"
        />
        {/* Base gradient + a slightly deeper wash that fades in on hover for contrast */}
        <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
        <div className="absolute inset-0 bg-primary/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Moving light reflection — sweeps across on hover */}
        <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[450%]" />

        {/* Difficulty (top-left) */}
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
            {a.difficulty}
          </span>
        </div>

        {/* Booking-open (or any) badge ribbon (top-right) */}
        {a.badge && (
          <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-glow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {a.badge}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <div className="mb-3 flex items-center gap-3 text-xs text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {a.duration}
            </span>
            <span>•</span>
            <span>{label ?? a.category}</span>
          </div>
          <h3 className="font-display text-2xl font-medium leading-tight">{a.title}</h3>

          {/* Description collapses on hover to make room for the fact chips */}
          <p className="mt-2 max-h-16 overflow-hidden text-sm text-white/75 opacity-100 transition-all duration-500 group-hover:max-h-0 group-hover:opacity-0 line-clamp-2">
            {a.description}
          </p>

          {/* Fact chips reveal on hover (glassmorphism) */}
          <div className="flex max-h-0 flex-wrap gap-2 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-24 group-hover:opacity-100">
            <Chip icon={Star}>4.9</Chip>
            {altitude && <Chip icon={Mountain}>{altitude} m</Chip>}
            <Chip icon={Clock}>{a.duration}</Chip>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/55">From</div>
              <div className="font-display text-xl text-accent">{a.price}</div>
            </div>
            {/* Floating pill CTA — expands from the circular arrow on hover */}
            <span className="inline-flex items-center gap-2 rounded-full bg-accent py-2.5 pl-4 pr-2.5 text-sm font-semibold text-primary shadow-lg transition-all duration-500 group-hover:pr-4">
              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 group-hover:max-w-[9rem] group-hover:opacity-100">
                Explore Journey
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
