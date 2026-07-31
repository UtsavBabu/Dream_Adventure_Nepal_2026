import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { Mountain, Search, SlidersHorizontal, X } from "lucide-react";

import { adventuresQuery, siteSettingsQuery, type Adventure } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { AdventureCard } from "@/components/site/adventure-card";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/treks")({
  head: () => ({
    meta: [
      { title: "Treks — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Explore our Himalayan treks: Everest Base Camp, Annapurna Circuit, Langtang Valley, and more. Filter by difficulty, duration and budget.",
      },
      { property: "og:title", content: "Himalayan Treks — Dream Adventure Nepal" },
      {
        property: "og:description",
        content:
          "Walk among the giants. Himalayan trekking adventures led by local Sherpa experts.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
    context.queryClient.ensureQueryData(adventuresQuery);
  },
  component: TreksPage,
});

function TreksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <TreksContent />
    </Suspense>
  );
}

const days = (a: Adventure) => {
  const m = a.duration.match(/\d+/);
  return m ? Number(m[0]) : 0;
};
const priceNum = (a: Adventure) => Number(a.price.replace(/[^0-9.]/g, "")) || 0;

const selectCls =
  "h-11 rounded-full border border-border bg-white px-4 text-sm text-primary shadow-sm focus:border-accent focus:outline-none";

function TreksContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: adventures } = useSuspenseQuery(adventuresQuery);
  useReveal();

  const treks = useMemo(() => adventures.filter((a) => a.category === "Trek"), [adventures]);

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [duration, setDuration] = useState("any");
  const [budget, setBudget] = useState("any");
  const [sort, setSort] = useState("featured");

  const difficulties = useMemo(
    () => ["All", ...Array.from(new Set(treks.map((t) => t.difficulty))).sort()],
    [treks],
  );

  const filtered = useMemo(() => {
    let r = treks.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (difficulty !== "All" && a.difficulty !== difficulty) return false;
      const d = days(a);
      if (duration === "short" && d > 7) return false;
      if (duration === "mid" && (d < 8 || d > 14)) return false;
      if (duration === "long" && d < 15) return false;
      const p = priceNum(a);
      if (budget === "low" && p >= 1000) return false;
      if (budget === "mid" && (p < 1000 || p > 2000)) return false;
      if (budget === "high" && p <= 2000) return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => priceNum(a) - priceNum(b));
    else if (sort === "price-desc") r = [...r].sort((a, b) => priceNum(b) - priceNum(a));
    else if (sort === "duration") r = [...r].sort((a, b) => days(a) - days(b));
    else r = [...r].sort((a, b) => a.sort_order - b.sort_order);
    return r;
  }, [treks, q, difficulty, duration, budget, sort]);

  const activeFilters = difficulty !== "All" || duration !== "any" || budget !== "any" || q !== "";
  const reset = () => {
    setQ("");
    setDifficulty("All");
    setDuration("any");
    setBudget("any");
    setSort("featured");
  };

  const pageHero =
    (settings?.treks_page as {
      hero_image?: string;
      badge?: string;
      title?: string;
      title_highlight?: string;
      subtitle?: string;
    }) ?? {};
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      {vis("treks_hero") && (
        <section className="relative flex min-h-[60vh] items-end bg-primary">
          <div className="absolute inset-0">
            <img
              src={
                pageHero.hero_image ||
                "https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1920"
              }
              alt="Himalayan treks"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-20 pt-32">
            <div className="reveal max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                <Mountain className="h-3.5 w-3.5" /> {pageHero.badge || "Himalayan Treks"}
              </div>
              <h1 className="mt-5 text-balance font-display text-h1 font-medium text-white">
                {pageHero.title || "Walk among the"}{" "}
                <em className="text-accent">{pageHero.title_highlight || "giants"}</em>
              </h1>
              <p className="mt-5 max-w-2xl text-subtitle text-white/75">
                {pageHero.subtitle ||
                  "From Everest Base Camp to the Annapurna Circuit — our treks take you deep into the world's most dramatic mountain scenery."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Trek listing + filters */}
      {vis("treks_listing") && (
        <section className="bg-surface py-20">
          <div className="mx-auto max-w-content px-6">
            {/* Filter bar */}
            <div className="sticky top-20 z-30 rounded-2xl border border-border bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search treks…"
                    className="h-11 w-full rounded-full border border-border bg-white pl-11 pr-4 text-sm text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={selectCls}
                  aria-label="Difficulty"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d === "All" ? "All difficulty" : d}
                    </option>
                  ))}
                </select>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={selectCls}
                  aria-label="Duration"
                >
                  <option value="any">Any duration</option>
                  <option value="short">Up to 7 days</option>
                  <option value="mid">8–14 days</option>
                  <option value="long">15+ days</option>
                </select>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={selectCls}
                  aria-label="Budget"
                >
                  <option value="any">Any budget</option>
                  <option value="low">Under $1,000</option>
                  <option value="mid">$1,000–$2,000</option>
                  <option value="high">Over $2,000</option>
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={selectCls}
                  aria-label="Sort by"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="duration">Duration: short to long</option>
                </select>
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="font-medium text-primary">{filtered.length}</span> of {treks.length} treks
                </span>
                {activeFilters && (
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    <X className="h-3.5 w-3.5" /> Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-subtitle text-primary">No treks match those filters.</p>
                <button onClick={reset} className="mt-4 text-sm font-medium text-accent hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a) => (
                  <AdventureCard key={a.id} adventure={a} label="Trek" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
