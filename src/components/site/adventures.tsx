import { ArrowUpRight, Clock, Mountain } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Adventure } from "@/lib/site-data";

const sectionConfig: Record<
  string,
  { icon: string; label: string; title: string; subtitle: string }
> = {
  Trek: {
    icon: "🥾",
    label: "Himalayan Treks",
    title: "Walk among the <em>giants</em>",
    subtitle:
      "From Everest Base Camp to the Annapurna Circuit — our treks take you deep into the world's most dramatic mountain scenery.",
  },
  Expedition: {
    icon: "⛰️",
    label: "Climbing Expeditions",
    title: "Summit your first <em>6,000m</em> peak",
    subtitle:
      "Technical climbs led by certified Sherpa guides. Island Peak, Mera Peak, Ama Dablam — your next milestone awaits.",
  },
  Tour: {
    icon: "🏛️",
    label: "Cultural Tours",
    title: "Discover Nepal's <em>soul</em>",
    subtitle:
      "UNESCO heritage sites, wildlife safaris, sunrise flights, and lakeside relaxation — curated by local experts.",
  },
};

export function AdventureSection({ items, category }: { items: Adventure[]; category: string }) {
  const cfg = sectionConfig[category];
  if (!cfg || items.length === 0) return null;

  return (
    <section id={`${category.toLowerCase()}s`} className="relative bg-surface py-28">
      <div id={category.toLowerCase()} className="sr-only" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] text-accent">
            <Mountain className="h-3.5 w-3.5" /> {cfg.label}
          </div>
          <h2
            className="mt-6 text-balance font-display text-h2 font-medium text-primary"
            dangerouslySetInnerHTML={{ __html: cfg.title }}
          />
          <p className="mt-5 text-subtitle text-muted-foreground">{cfg.subtitle}</p>
        </div>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <Link
              key={a.id}
              to="/adventures/$slug"
              params={{ slug: a.slug }}
              className="reveal group card-elevate block overflow-hidden rounded-3xl bg-white shadow-glass ring-1 ring-black/[0.04] transition-shadow hover:ring-2 hover:ring-accent/40"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={a.image_url}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
                    {a.difficulty}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-3 flex items-center gap-3 text-xs text-white/75">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {a.duration}
                    </span>
                    <span>•</span>
                    <span>{a.category}</span>
                  </div>
                  <h3 className="font-display text-2xl font-medium leading-tight">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/75">{a.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-white/55">From</div>
                      <div className="font-display text-xl text-accent">{a.price}</div>
                    </div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Keep old name for backwards compatibility
export const Adventures = AdventureSection;
