import { useEffect, useRef, useState } from "react";
import { Check, Mountain, X } from "lucide-react";

type ItineraryDay = { day: number; title: string; description: string };

/* Small heading used when a module renders "bare" inside the two-column body. */
function BareHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 font-display text-h3 font-medium text-primary">{title}</h2>
    </div>
  );
}

/* Pull the first credible altitude out of a day's text (e.g. "5,364 m"). */
function altOf(text: string): string | null {
  const m = text.match(/(\d[\d,]{2,})\s*m\b/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  // Skip 7-8000m figures — those are peaks viewed from a day, not that day's altitude.
  return n >= 1000 && n <= 6900 ? `${n.toLocaleString()} m` : null;
}

/**
 * Animated journey timeline: a connector line that "draws itself" as the section
 * scrolls through the viewport, with day markers that light up in sequence.
 * The line height is written straight to the DOM (ref) so scrolling stays 60fps;
 * only the small set of marker states goes through React.
 */
function RouteTimeline({ days }: { days: ItineraryDay[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (lineRef.current) lineRef.current.style.height = "100%";
      setActiveCount(days.length);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(Math.max((vh * 0.62 - rect.top) / Math.max(rect.height, 1), 0), 1);
      if (lineRef.current) lineRef.current.style.height = `${p * 100}%`;
      const ac = Math.round(p * days.length);
      setActiveCount((prev) => (prev === ac ? prev : ac));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [days.length]);

  return (
    <div ref={wrapRef} className="relative mt-8">
      {/* faint full-length track */}
      <div className="absolute bottom-0 left-6 top-0 w-0.5 -translate-x-1/2 bg-border" aria-hidden />
      {/* self-drawing progress line */}
      <div
        ref={lineRef}
        className="absolute left-6 top-0 h-0 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent to-accent/30"
        aria-hidden
      />
      <div className="space-y-8">
        {days.map((d, i) => {
          const active = i < activeCount;
          const alt = altOf(`${d.title} ${d.description}`);
          return (
            <div key={d.day} className="relative flex gap-5">
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-semibold transition-all duration-500 ${
                    active
                      ? "scale-105 border-accent bg-accent text-primary shadow-glow"
                      : "border-border bg-white text-muted-foreground"
                  }`}
                >
                  {d.day}
                </div>
              </div>
              <div className="pb-2 pt-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Day {d.day}
                  </span>
                  <h3 className="font-display text-xl text-primary">{d.title}</h3>
                  {alt && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      <Mountain className="h-3 w-3 text-accent" /> {alt}
                    </span>
                  )}
                </div>
                <p className="mt-2 leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdventureItinerary({ days, bare }: { days: ItineraryDay[]; bare?: boolean }) {
  if (!days || days.length === 0) return null;
  const body = (
    <>
      {bare ? (
        <BareHead eyebrow="Itinerary" title="Your journey, day by day" />
      ) : (
        <div className="reveal text-center">
          <div className="eyebrow">Itinerary</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Your journey, day by day
          </h2>
        </div>
      )}
      <div className="reveal">
        <RouteTimeline days={days} />
      </div>
    </>
  );
  if (bare) return <div>{body}</div>;
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-reading px-6">{body}</div>
    </section>
  );
}

export function AdventureIncludesExcludes({
  includes,
  excludes,
  bare,
}: {
  includes: string[];
  excludes: string[];
  bare?: boolean;
}) {
  if ((!includes || includes.length === 0) && (!excludes || excludes.length === 0)) return null;
  const body = (
    <>
      {bare && <BareHead eyebrow="Logistics" title="What's included" />}
      <div className={`reveal grid gap-10 md:grid-cols-2 ${bare ? "mt-8" : ""}`}>
        {includes && includes.length > 0 && (
          <div>
            {!bare && <h3 className="font-display text-2xl text-primary">What's included</h3>}
            {bare && (
              <div className="text-caption font-semibold uppercase tracking-wider text-success">
                Included
              </div>
            )}
            <ul className={`${bare ? "mt-4" : "mt-6"} space-y-3`}>
              {includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {excludes && excludes.length > 0 && (
          <div>
            {!bare && <h3 className="font-display text-2xl text-primary">What's excluded</h3>}
            {bare && (
              <div className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
                Not included
              </div>
            )}
            <ul className={`${bare ? "mt-4" : "mt-6"} space-y-3`}>
              {excludes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                    <X className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
  if (bare) return <div>{body}</div>;
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">{body}</div>
    </section>
  );
}

export function AdventureHighlights({ items, bare }: { items: string[]; bare?: boolean }) {
  if (!items || items.length === 0) return null;
  const body = (
    <>
      {bare ? (
        <BareHead eyebrow="Highlights" title="What makes this trip special" />
      ) : (
        <div className="reveal text-center">
          <div className="eyebrow">Highlights</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            What makes this trip special
          </h2>
        </div>
      )}
      <div
        className={`reveal grid gap-4 sm:grid-cols-2 ${bare ? "mt-8" : "mt-10 lg:grid-cols-3"}`}
      >
        {items.map((h, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-glass"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">{h}</p>
          </div>
        ))}
      </div>
    </>
  );
  if (bare) return <div>{body}</div>;
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-content px-6">{body}</div>
    </section>
  );
}
