import { Check, Sunrise } from "lucide-react";

type ItineraryDay = { day: number; title: string; description: string };

export function AdventureItinerary({ days }: { days: ItineraryDay[] }) {
  if (!days || days.length === 0) return null;
  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="reveal text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Itinerary
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium text-primary">
            Day-by-day breakdown
          </h2>
        </div>
        <div className="reveal mt-14 space-y-6">
          {days.map((d, i) => (
            <div key={d.day} className="group flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                  <Sunrise className="h-5 w-5" />
                </div>
                {i < days.length - 1 && (
                  <div className="mt-2 h-full w-px bg-border group-hover:bg-accent/30" />
                )}
              </div>
              <div className="pb-8 pt-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Day {d.day}
                  </span>
                  <h3 className="font-display text-xl text-primary">{d.title}</h3>
                </div>
                <p className="mt-2 leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdventureIncludesExcludes({
  includes,
  excludes,
}: {
  includes: string[];
  excludes: string[];
}) {
  if ((!includes || includes.length === 0) && (!excludes || excludes.length === 0)) return null;
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal grid gap-10 md:grid-cols-2">
          {includes && includes.length > 0 && (
            <div>
              <h3 className="font-display text-2xl text-primary">What's included</h3>
              <ul className="mt-6 space-y-3">
                {includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {excludes && excludes.length > 0 && (
            <div>
              <h3 className="font-display text-2xl text-primary">What's excluded</h3>
              <ul className="mt-6 space-y-3">
                {excludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-red-300 text-xs text-red-500">×</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AdventureHighlights({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Highlights
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium text-primary">
            What makes this trip special
          </h2>
        </div>
        <div className="reveal mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((h, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-glass">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{h}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
