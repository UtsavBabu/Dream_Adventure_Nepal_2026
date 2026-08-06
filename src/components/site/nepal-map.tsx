import { useMemo, useState } from "react";
import { ArrowRight, Clock, MapPin, Mountain } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Adventure } from "@/lib/site-data";
import { NEPAL_PATH, NEPAL_REGIONS, NEPAL_VIEWBOX, regionFor } from "@/lib/nepal-geo";

export function NepalMap({ items }: { items: Adventure[] }) {
  const counts = useMemo(() => {
    const m: Record<string, Adventure[]> = {};
    for (const r of NEPAL_REGIONS) m[r.id] = [];
    for (const a of items) {
      const r = regionFor(`${a.title} ${a.slug}`);
      if (r) m[r.id].push(a);
    }
    return m;
  }, [items]);

  const defaultId =
    [...NEPAL_REGIONS].map((r) => r.id).sort((a, b) => counts[b].length - counts[a].length)[0] ??
    "everest";
  const [sel, setSel] = useState(defaultId);
  const region = NEPAL_REGIONS.find((r) => r.id === sel)!;
  const list = counts[sel] ?? [];
  const { w, h } = NEPAL_VIEWBOX;

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-white lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">Explore the map</div>
          <h2 className="mt-4 text-balance font-display text-h2 font-medium">
            Find your region of Nepal
          </h2>
          <p className="mt-4 text-subtitle text-white/70">
            Tap a region on the map to see the journeys that begin there.
          </p>
        </div>

        <div className="reveal mt-14 grid gap-8 lg:grid-cols-5">
          {/* Real Nepal map */}
          <div className="lg:col-span-3">
            <div
              className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a1c33] p-3 shadow-elegant sm:p-6"
              style={{ aspectRatio: `${w} / ${h}` }}
            >
              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="absolute inset-0 h-full w-full p-3 sm:p-6"
                role="img"
                aria-label="Map of Nepal"
              >
                <defs>
                  <linearGradient id="npl-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16324f" />
                    <stop offset="100%" stopColor="#0d243d" />
                  </linearGradient>
                  <filter id="npl-glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#ff8c32" floodOpacity="0.28" />
                  </filter>
                </defs>
                <path
                  d={NEPAL_PATH}
                  fill="url(#npl-fill)"
                  stroke="rgba(255,140,50,0.55)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  filter="url(#npl-glow)"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Region pins (percentage-positioned to the viewBox) */}
              {NEPAL_REGIONS.map((r) => {
                const active = r.id === sel;
                const n = counts[r.id].length;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSel(r.id)}
                    aria-label={`${r.name} (${n})`}
                    aria-pressed={active}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    style={{ left: `${(r.x / w) * 100}%`, top: `${(r.y / h) * 100}%` }}
                  >
                    <span className="relative flex items-center justify-center">
                      {active && (
                        <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-accent/50" />
                      )}
                      <span
                        className={`relative rounded-full ring-2 transition-all duration-300 ${
                          active
                            ? "h-3.5 w-3.5 scale-110 bg-accent ring-white"
                            : n
                              ? "h-2.5 w-2.5 bg-white/85 ring-white/40 group-hover:scale-125 group-hover:bg-accent"
                              : "h-2 w-2 bg-white/25 ring-white/20"
                        }`}
                      />
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 max-w-[90px] truncate rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold transition-all duration-300 ${
                        active
                          ? "bg-accent text-primary opacity-100 shadow"
                          : "bg-black/50 text-white/85 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected region panel */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
              <div className="inline-flex items-center gap-2 text-accent">
                <MapPin className="h-4 w-4" />
                <span className="text-caption font-semibold uppercase tracking-wider">
                  {list.length} {list.length === 1 ? "journey" : "journeys"}
                </span>
              </div>
              <h3 className="mt-3 font-display text-h3 font-medium">{region.name}</h3>
              <p className="mt-2 text-small leading-relaxed text-white/65">{region.blurb}</p>

              <div className="mt-6 space-y-2">
                {list.length === 0 && (
                  <p className="text-small text-white/50">New journeys coming to this region soon.</p>
                )}
                {list.slice(0, 4).map((a) => (
                  <Link
                    key={a.id}
                    to="/adventures/$slug"
                    params={{ slug: a.slug }}
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-accent/40 hover:bg-white/[0.06]"
                  >
                    <img
                      src={a.image_url || undefined}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-small font-semibold text-white">{a.title}</div>
                      <div className="mt-0.5 flex items-center gap-3 text-[11px] text-white/55">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {a.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 text-accent">
                          <Mountain className="h-3 w-3" /> {a.price}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
