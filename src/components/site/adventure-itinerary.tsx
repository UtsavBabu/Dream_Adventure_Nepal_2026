import { Check, Sunrise, X } from "lucide-react";

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

export function AdventureItinerary({ days, bare }: { days: ItineraryDay[]; bare?: boolean }) {
  if (!days || days.length === 0) return null;
  const body = (
    <>
      {bare ? (
        <BareHead eyebrow="Itinerary" title="Day-by-day breakdown" />
      ) : (
        <div className="reveal text-center">
          <div className="eyebrow">Itinerary</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Day-by-day breakdown
          </h2>
        </div>
      )}
      <div className={`reveal ${bare ? "mt-8" : "mt-14"} space-y-6`}>
        {days.map((d, i) => (
          <div key={d.day} className="group flex gap-5">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-primary">
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
