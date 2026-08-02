import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Star,
  HeartHandshake,
  MessageCircle,
  BadgeCheck,
  MountainSnow,
} from "lucide-react";
import type { Adventure } from "@/lib/site-data";
import { AdventureCard } from "@/components/site/adventure-card";

const WA = "https://wa.me/9779767832384";

const days = (a: Adventure) => {
  const m = a.duration.match(/\d+/);
  return m ? Number(m[0]) : 0;
};
const priceNum = (a: Adventure) => Number(a.price.replace(/[^0-9.]/g, "")) || 0;

const selectCls =
  "h-11 w-full rounded-full border border-border bg-white px-4 text-[15px] text-primary shadow-sm transition hover:border-primary/30 focus:border-accent focus:outline-none";

/**
 * Reusable listing with a 3-zone layout on wide screens: a sticky filter rail,
 * the results grid, and a sticky "plan with an expert" help card — so the side
 * space is used, not empty. Collapses to a stacked layout on smaller screens.
 * Shared by Treks, Tours and Expeditions.
 */
export function AdventureListing({
  items,
  category,
  label,
}: {
  items: Adventure[];
  category: string;
  label: string;
}) {
  const list = useMemo(() => items.filter((a) => a.category === category), [items, category]);
  const plural = `${label.toLowerCase()}s`;

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [duration, setDuration] = useState("any");
  const [budget, setBudget] = useState("any");
  const [sort, setSort] = useState("featured");

  const difficulties = useMemo(
    () => ["All", ...Array.from(new Set(list.map((t) => t.difficulty))).sort()],
    [list],
  );

  const filtered = useMemo(() => {
    let r = list.filter((a) => {
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
  }, [list, q, difficulty, duration, budget, sort]);

  const activeFilters = difficulty !== "All" || duration !== "any" || budget !== "any" || q !== "";
  const reset = () => {
    setQ("");
    setDifficulty("All");
    setDuration("any");
    setBudget("any");
    setSort("featured");
  };

  const filterPanel = (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 font-display text-lg text-primary">
        <SlidersHorizontal className="h-4 w-4 text-accent" /> Filter {plural}
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${plural}…`}
          className="h-11 w-full rounded-full border border-border bg-white pl-11 pr-4 text-[15px] text-primary shadow-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-1">
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectCls} aria-label="Difficulty">
          {difficulties.map((d) => (
            <option key={d} value={d}>{d === "All" ? "All difficulty" : d}</option>
          ))}
        </select>
        <select value={duration} onChange={(e) => setDuration(e.target.value)} className={selectCls} aria-label="Duration">
          <option value="any">Any duration</option>
          <option value="short">Up to 7 days</option>
          <option value="mid">8–14 days</option>
          <option value="long">15+ days</option>
        </select>
        <select value={budget} onChange={(e) => setBudget(e.target.value)} className={selectCls} aria-label="Budget">
          <option value="any">Any budget</option>
          <option value="low">Under $1,000</option>
          <option value="mid">$1,000–$2,000</option>
          <option value="high">Over $2,000</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls} aria-label="Sort by">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="duration">Duration: short to long</option>
        </select>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4 text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-primary">{filtered.length}</span> of {list.length}
        </span>
        {activeFilters && (
          <button onClick={reset} className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );

  const trust = [
    { icon: BadgeCheck, label: "Nepal Tourism Board licensed" },
    { icon: Star, label: "4.9 / 5 traveler rating" },
    { icon: ShieldCheck, label: "Free cancellation · 5 days" },
    { icon: MountainSnow, label: "100% local Sherpa team" },
  ];
  const helpPanel = (
    <div className="space-y-4">
      <div className="rounded-3xl bg-primary p-6 text-white shadow-elegant">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-medium">Not sure which {label.toLowerCase()}?</h3>
        <p className="mt-2 text-small leading-relaxed text-white/70">
          Tell us your dates, budget and fitness — a local expert will craft your perfect itinerary,
          free and with no obligation.
        </p>
        <a
          href={`${WA}?text=${encodeURIComponent(`Hi Dream Adventure Nepal, I'd like help choosing a ${label.toLowerCase()}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-full btn-primary py-3 text-small font-semibold"
        >
          <MessageCircle className="h-4 w-4" /> Plan with an expert
        </a>
      </div>
      <div className="rounded-3xl border border-border bg-white p-6">
        <ul className="space-y-3">
          {trust.map(({ icon: Icon, label: l }) => (
            <li key={l} className="flex items-center gap-3 text-small text-muted-foreground">
              <Icon className="h-4 w-4 shrink-0 text-accent" /> {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section className="bg-surface pb-20 pt-12 lg:pb-28 lg:pt-16">
      <div className="mx-auto grid w-full max-w-[112rem] gap-8 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-10 2xl:grid-cols-[300px_minmax(0,1fr)_320px] 2xl:gap-12">
        {/* Left: sticky filter rail */}
        <aside className="lg:sticky lg:top-24 lg:self-start">{filterPanel}</aside>

        {/* Center: results grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-border bg-white py-24 text-center">
              <p className="text-subtitle text-primary">No {plural} match those filters.</p>
              <button onClick={reset} className="mt-4 text-sm font-medium text-accent hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="reveal stagger grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((a) => (
                <AdventureCard key={a.id} adventure={a} label={label} />
              ))}
            </div>
          )}
        </div>

        {/* Right: sticky help card (wide screens) */}
        <aside className="hidden 2xl:block 2xl:sticky 2xl:top-24 2xl:self-start">{helpPanel}</aside>
      </div>
    </section>
  );
}
