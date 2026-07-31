import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Adventure } from "@/lib/site-data";
import { AdventureCard } from "@/components/site/adventure-card";

const days = (a: Adventure) => {
  const m = a.duration.match(/\d+/);
  return m ? Number(m[0]) : 0;
};
const priceNum = (a: Adventure) => Number(a.price.replace(/[^0-9.]/g, "")) || 0;

const selectCls =
  "h-12 rounded-full border border-border bg-white px-5 text-[15px] text-primary shadow-sm transition hover:border-primary/30 focus:border-accent focus:outline-none";

/**
 * Reusable listing: a floating glass filter panel that overlaps the page hero,
 * plus the results grid. Shared by Treks, Tours and Expeditions.
 * The parent page renders its own hero above this (with room via pb-28+).
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

  return (
    <section className="bg-surface pb-20 lg:pb-28">
      <div className="mx-auto max-w-content px-6">
        {/* Floating filter — overlaps the hero, Airbnb-style glass */}
        <div className="relative z-30 -mt-16 rounded-3xl border border-white/50 bg-white/75 p-5 shadow-elegant backdrop-blur-xl sm:-mt-20 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${plural}…`}
                className="h-14 w-full rounded-full border border-border bg-white pl-14 pr-5 text-base text-primary shadow-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-3">
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
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/70 px-1 pt-4">
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="font-semibold text-primary">{filtered.length}</span> of {list.length}{" "}
              {plural}
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
            <p className="text-subtitle text-primary">No {plural} match those filters.</p>
            <button
              onClick={reset}
              className="mt-4 text-sm font-medium text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <AdventureCard key={a.id} adventure={a} label={label} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
