import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Adventure } from "@/lib/site-data";

// The three ways into Nepal. Images, counts and the "popular routes" that reveal
// on hover all come straight from the published adventures.
const CATS = [
  {
    key: "Trek",
    href: "/treks",
    label: "Himalayan Treks",
    desc: "Everest Base Camp, Annapurna & hidden valleys on foot.",
    emoji: "🥾",
  },
  {
    key: "Expedition",
    href: "/expeditions",
    label: "Climbing Expeditions",
    desc: "Summit your first 6,000m Himalayan peak with Sherpa guides.",
    emoji: "⛰️",
  },
  {
    key: "Tour",
    href: "/tours",
    label: "Tours & Pilgrimage",
    desc: "Culture, wildlife and sacred journeys like Kailash Mansarovar.",
    emoji: "🛕",
  },
] as const;

export function AdventurePaths({ items }: { items: Adventure[] }) {
  const tiles = CATS.map((c) => {
    const inCat = items.filter((a) => a.category === c.key);
    return inCat.length
      ? { ...c, count: inCat.length, image: inCat[0].image_url, routes: inCat.slice(0, 3).map((a) => a.title) }
      : null;
  }).filter(Boolean) as Array<
    (typeof CATS)[number] & { count: number; image: string; routes: string[] }
  >;

  if (tiles.length === 0) return null;

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">Choose Your Adventure</div>
          <h2 className="mt-4 text-balance font-display text-h2 font-medium text-primary">
            Three ways to meet the mountains
          </h2>
          <p className="mt-4 text-subtitle text-muted-foreground">
            Pick the journey that calls to you — every path is led by our local Sherpa team.
          </p>
        </div>

        <div className="reveal stagger mt-14 grid gap-6 lg:grid-cols-3">
          {tiles.map((t) => (
            <Link
              key={t.key}
              to={t.href as string}
              className="group card-elevate relative block h-[26rem] overflow-hidden rounded-3xl shadow-glass"
            >
              <img
                src={t.image || undefined}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
              {/* light sweep */}
              <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[450%]" />

              {/* Base label — fades out as the glass panel rises */}
              <div className="absolute inset-x-0 bottom-0 p-8 text-white transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-0">
                <div className="text-3xl">{t.emoji}</div>
                <h3 className="mt-3 font-display text-h3 font-medium">{t.label}</h3>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-caption uppercase tracking-wider text-white/60">
                    {t.count} {t.count === 1 ? "journey" : "journeys"}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Glassmorphism reveal — frosted detail panel on hover */}
              <div className="absolute inset-x-4 bottom-4 translate-y-6 rounded-2xl glass p-6 text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{t.emoji}</span>
                  <h3 className="font-display text-2xl font-medium">{t.label}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{t.desc}</p>
                {t.routes.length > 0 && (
                  <div className="mt-4">
                    <div className="text-caption uppercase tracking-wider text-white/55">
                      Popular routes
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {t.routes.map((r) => (
                        <li key={r} className="flex items-center gap-2 text-sm text-white/90">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span className="truncate">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary">
                  Explore {t.count} {t.count === 1 ? "journey" : "journeys"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
