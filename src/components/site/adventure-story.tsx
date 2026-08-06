import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Star,
  MountainSnow,
  TrendingUp,
  Sun,
  Snowflake,
  CloudRain,
  Leaf,
  Backpack,
  Shirt,
  Footprints,
  Compass,
  HeartPulse,
  Award,
  Check,
  MessageCircle,
} from "lucide-react";
import type { Adventure, SiteSettings } from "@/lib/site-data";
import { AdventureCard } from "@/components/site/adventure-card";
import { regionFor } from "@/lib/nepal-geo";

/* ─────────────────────────── Trust badges band ─────────────────────────── */
export function AdventureTrust({ settings }: { settings: SiteSettings }) {
  const legal = (settings?.legal ?? {}) as { registration_no?: string };
  const hero = (settings?.hero ?? {}) as { stats?: Array<{ label: string; value: string }> };
  const rating = hero.stats?.find((s) => /rating/i.test(s.label))?.value ?? "4.9/5";
  const items = [
    { icon: ShieldCheck, label: "Nepal Tourism Board licensed" },
    { icon: Star, label: `${rating} traveler rating` },
    { icon: BadgeCheck, label: legal.registration_no ? `Reg. ${legal.registration_no}` : "Registered operator" },
    { icon: HeartPulse, label: "Free cancellation · 5 days" },
    { icon: MountainSnow, label: "1:1 Sherpa on summit day" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 md:justify-between">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="inline-flex items-center gap-2.5 text-small font-medium text-primary">
              <Icon className="h-5 w-5 shrink-0 text-accent" /> {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Sticky booking sidebar (desktop two-column) ────────────── */
export function BookingSidebar({
  adventure,
  waUrl,
}: {
  adventure: Adventure;
  waUrl?: string | null;
}) {
  const maxElev = useMemo(() => {
    let m = 0;
    (adventure.itinerary ?? []).forEach((d) => {
      for (const x of `${d.title} ${d.description}`.matchAll(/(\d[\d,]{2,})\s*m\b/g)) {
        const n = Number(x[1].replace(/,/g, ""));
        if (n >= 1000 && n <= 9000 && n > m) m = n;
      }
    });
    return m;
  }, [adventure.itinerary]);

  const facts = [
    { label: "Duration", value: adventure.duration },
    { label: "Difficulty", value: adventure.difficulty },
    { label: "Type", value: adventure.category },
    ...(maxElev ? [{ label: "Max altitude", value: `${maxElev.toLocaleString()} m` }] : []),
  ];
  const topIncludes = (adventure.includes ?? []).slice(0, 4);

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-elegant">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-caption uppercase tracking-wider text-muted-foreground">From</div>
            <div className="font-display text-h2 font-medium text-accent">{adventure.price}</div>
          </div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold uppercase tracking-wider text-accent">
            {adventure.difficulty}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-5">
          {facts.map((f) => (
            <div key={f.label}>
              <div className="text-caption uppercase tracking-wider text-muted-foreground">
                {f.label}
              </div>
              <div className="mt-0.5 text-small font-semibold text-primary">{f.value}</div>
            </div>
          ))}
        </div>

        <a
          href="#book"
          className="mt-5 block rounded-full btn-primary py-3.5 text-center text-small font-semibold"
        >
          Book This Adventure
        </a>
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border py-3 text-small font-semibold text-primary transition hover:border-primary"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
          </a>
        )}

        <div className="mt-5 space-y-2 border-t border-border pt-5 text-caption text-muted-foreground">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 shrink-0 text-accent" /> Free cancellation up to 5 days
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" /> 35% deposit secures your dates
          </div>
          <div className="flex items-center gap-2">
            <MountainSnow className="h-4 w-4 shrink-0 text-accent" /> Government-licensed, Sherpa-led
          </div>
        </div>

        {topIncludes.length > 0 && (
          <div className="mt-5 border-t border-border pt-5">
            <div className="text-caption uppercase tracking-wider text-muted-foreground">
              What's included
            </div>
            <ul className="mt-3 space-y-2">
              {topIncludes.map((it) => (
                <li key={it} className="flex items-start gap-2 text-caption text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {it}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ─────────────── Elevation profile (derived from itinerary) ─────────────── */
type Day = { day: number; title: string; description: string };

// Short place label from a day title, e.g. "Kora Day 1 — Darchen to Dirapuk" -> "Dirapuk".
function placeOf(title: string): string {
  let t = title.split(/→|➝|->/).pop() ?? title;
  if (/ to /i.test(t)) t = t.split(/ to /i).pop() ?? t;
  t = t.replace(
    /^(arrival in|drive|drive to|trek to|flight to|fly to|hike to|explore|acclimati[sz]ation( day)? in|reserve day in|rest day in)\s+/i,
    "",
  );
  t = t.split(/[,(—–]/)[0].replace(/\bday \d+\b/i, "").trim();
  return t || title;
}

// One point per itinerary day; altitudes parsed from the text, gaps interpolated
// between known points so ascents *and* descents render (cap 6,900 m — larger
// figures are peaks viewed, not altitudes reached).
function buildElevation(itinerary: Day[]) {
  if (!itinerary?.length) return [];
  const pts = itinerary.map((d) => {
    const nums = [...`${d.title} ${d.description}`.matchAll(/(\d[\d,]{2,})\s*m\b/g)]
      .map((m) => Number(m[1].replace(/,/g, "")))
      .filter((n) => n >= 1000 && n <= 6900);
    return { day: d.day, place: placeOf(d.title), alt: nums.length ? Math.max(...nums) : null as number | null };
  });
  const known = pts.map((p, i) => (p.alt != null ? i : -1)).filter((i) => i >= 0);
  if (!known.length) return [];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i].alt != null) continue;
    const prev = [...known].reverse().find((k) => k < i);
    const next = known.find((k) => k > i);
    if (prev != null && next != null) {
      const t = (i - prev) / (next - prev);
      pts[i].alt = Math.round(pts[prev].alt! + t * (pts[next].alt! - pts[prev].alt!));
    } else pts[i].alt = pts[prev ?? next!].alt;
  }
  return pts as Array<{ day: number; place: string; alt: number }>;
}

export function ElevationProfile({
  itinerary,
  difficulty,
  bare,
}: {
  itinerary: Day[];
  difficulty: string;
  bare?: boolean;
}) {
  const points = useMemo(() => buildElevation(itinerary), [itinerary]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<number | null>(null);

  if (points.length < 3) return null;

  const W = 1000;
  const H = 260;
  const pad = 34;
  const alts = points.map((p) => p.alt);
  const max = Math.max(...alts);
  const min = Math.min(...alts);
  const span = Math.max(max - min, 400);
  const x = (i: number) => pad + (i / (points.length - 1)) * (W - pad * 2);
  const y = (a: number) => H - pad - ((a - min) / span) * (H - pad * 2);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.alt).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(points.length - 1).toFixed(1)} ${H - pad} L ${x(0).toFixed(1)} ${H - pad} Z`;
  const peakIdx = alts.indexOf(max);
  const start = points[0];
  const end = points[points.length - 1];
  const act = active != null ? points[active] : null;

  const onMove = (e: ReactMouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const dataF = Math.min(Math.max((fx * W - pad) / (W - pad * 2), 0), 1);
    setActive(Math.round(dataF * (points.length - 1)));
  };

  const body = (
    <>
        <div className="reveal mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-reading">
            <div className="eyebrow">Altitude &amp; difficulty</div>
            <h2
              className={`mt-3 font-display ${bare ? "text-h3" : "text-h2"} font-medium text-primary`}
            >
              The climb, day by day
            </h2>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="font-display text-h3 font-medium text-accent num">{max.toLocaleString()}m</div>
              <div className="text-caption uppercase tracking-wider text-muted-foreground">Max elevation</div>
            </div>
            <div>
              <div className="font-display text-h3 font-medium text-primary">{difficulty}</div>
              <div className="text-caption uppercase tracking-wider text-muted-foreground">Difficulty</div>
            </div>
          </div>
        </div>

        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          className="reveal relative overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-glass sm:p-6"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none" role="img" aria-label="Elevation profile">
            <defs>
              <linearGradient id="elev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF8C32" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF8C32" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="#E2E8F0" strokeWidth="1" />
            ))}
            <path d={area} fill="url(#elev)" />
            <path d={line} fill="none" stroke="#FF8C32" strokeWidth="2.5" strokeLinejoin="round" />
            {/* hover guide line */}
            {act && (
              <line x1={x(active!)} x2={x(active!)} y1={pad} y2={H - pad} stroke="#FF8C32" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
            )}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(p.alt)}
                r={i === active ? 6 : i === peakIdx ? 5 : 3}
                fill={i === peakIdx || i === active ? "#FF8C32" : "#0B2341"}
              />
            ))}
            <text x={x(peakIdx)} y={y(max) - 14} textAnchor="middle" className="fill-primary" fontSize="19" fontWeight="600">
              {points[peakIdx].place} · {max.toLocaleString()}m
            </text>
          </svg>

          {/* interactive tooltip */}
          {act && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-xl bg-primary px-3 py-2 text-center text-white shadow-elegant"
              style={{ left: `${(x(active!) / W) * 100}%`, top: `${(y(act.alt) / H) * 100}%` }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">Day {act.day} · {act.place}</div>
              <div className="font-display text-base leading-tight">{act.alt.toLocaleString()} m</div>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between gap-3 px-2 text-caption text-muted-foreground">
            <span className="truncate">Day {start.day} · {start.place}</span>
            <span className="hidden shrink-0 items-center gap-1.5 sm:inline-flex">
              <TrendingUp className="h-3.5 w-3.5 text-accent" /> Hover the line for each day
            </span>
            <span className="truncate text-right">Day {end.day} · {end.place}</span>
          </div>
        </div>
    </>
  );
  if (bare) return <div>{body}</div>;
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">{body}</div>
    </section>
  );
}

/* ───────────────────────────── Best season ─────────────────────────────── */
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const SEASONS = [
  {
    icon: Leaf,
    name: "Spring",
    months: "Mar – May",
    monthIdx: [2, 3, 4],
    tier: "Peak",
    best: true,
    note: "Rhododendron forests in bloom, warm days and clear mornings.",
    tip: "Best for high passes and Base Camps before the summer haze arrives.",
    treks: ["Everest Base Camp", "Annapurna Sanctuary", "Langtang Valley"],
  },
  {
    icon: Sun,
    name: "Autumn",
    months: "Sep – Nov",
    monthIdx: [8, 9, 10],
    tier: "Peak",
    best: true,
    note: "The classic season — stable weather and the sharpest Himalayan views of the year.",
    tip: "Book early: this is the busiest and most reliable trekking window.",
    treks: ["Everest Base Camp", "Annapurna Circuit", "Manaslu Circuit"],
  },
  {
    icon: CloudRain,
    name: "Monsoon",
    months: "Jun – Aug",
    monthIdx: [5, 6, 7],
    tier: "Rain-shadow",
    best: false,
    note: "Green and quiet. Head behind the main range to the rain-shadow valleys that stay dry.",
    tip: "Choose Mustang or Dolpo — they sit in the rain shadow and stay trekkable.",
    treks: ["Upper Mustang", "Upper Dolpo", "Nar Phu Valley"],
  },
  {
    icon: Snowflake,
    name: "Winter",
    months: "Dec – Feb",
    monthIdx: [11, 0, 1],
    tier: "Crisp & quiet",
    best: false,
    note: "Crystal-clear skies and empty trails — keep to lower altitudes to stay comfortable.",
    tip: "Stick to lower, sunnier routes; high passes can be snowed in.",
    treks: ["Ghorepani Poon Hill", "Mardi Himal", "Everest View Trek"],
  },
];

export function BestSeason() {
  // Which season are we in right now? (drives the default selection + badge)
  const currentIdx = SEASONS.findIndex((s) => s.monthIdx.includes(new Date().getMonth()));
  const [sel, setSel] = useState(currentIdx >= 0 ? currentIdx : 0);
  const selMonths = new Set(SEASONS[sel].monthIdx);
  const nowMonth = new Date().getMonth();

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">When to go</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Nepal treks year-round
          </h2>
          <p className="mt-4 text-subtitle text-muted-foreground">
            Spring and autumn are the peak windows — but with the right region, every season
            delivers. Tap a season to see where to go.
          </p>
          {currentIdx >= 0 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-small font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Right now it's {SEASONS[currentIdx].name} — {SEASONS[currentIdx].tip}
            </div>
          )}
        </div>

        {/* Interactive month strip — click a month to jump to its season */}
        <div className="reveal mx-auto mt-10 flex max-w-content overflow-x-auto pb-4 justify-start sm:justify-center gap-1.5 snap-x scrollbar-none">
          {MONTHS.map((m, i) => {
            const inSel = selMonths.has(i);
            const seasonOfMonth = SEASONS.findIndex((s) => s.monthIdx.includes(i));
            const isNow = i === nowMonth;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSel(seasonOfMonth)}
                aria-label={`${SEASONS[seasonOfMonth].name} season`}
                className="group min-w-[44px] sm:min-w-0 flex-1 snap-start text-center focus:outline-none"
              >
                <div
                  className={`relative h-16 rounded-lg transition-all duration-300 ${
                    inSel ? "bg-accent" : SEASONS[seasonOfMonth].best ? "bg-accent/45" : "bg-accent/15"
                  } group-hover:brightness-95`}
                >
                  {isNow && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow">
                      Now
                    </span>
                  )}
                </div>
                <div className={`mt-2 text-caption font-medium ${inSel ? "text-primary" : "text-muted-foreground"}`}>
                  {m}
                </div>
              </button>
            );
          })}
        </div>
        <div className="reveal mx-auto mt-4 flex flex-wrap max-w-content items-center justify-center gap-3 sm:gap-6 text-caption text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Selected season
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/45" /> Peak window
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/15" /> Select regions
          </span>
        </div>

        <div className="reveal stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map(({ icon: Icon, name, months, note, tip, treks, tier }, i) => {
            const selected = i === sel;
            const isCurrent = i === currentIdx;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSel(i)}
                className={`flex flex-col rounded-2xl border p-6 text-left transition-all duration-300 ${
                  selected
                    ? "border-accent bg-white shadow-elegant ring-2 ring-accent/40 -translate-y-1"
                    : "border-border bg-white hover:-translate-y-0.5 hover:shadow-glass"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${selected ? "bg-accent text-primary" : "bg-primary/10 text-primary"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {isCurrent ? (
                    <span className="badge !px-2.5 !py-1 !text-[10px]">In season now</span>
                  ) : (
                    <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {tier}
                    </span>
                  )}
                </div>
                <div className="mt-4 font-display text-xl text-primary">{name}</div>
                <div className="mt-1 text-caption uppercase tracking-wider text-muted-foreground">
                  {months}
                </div>
                <p className="mt-3 text-small leading-relaxed text-muted-foreground">{note}</p>
                {selected && (
                  <p className="mt-3 rounded-xl bg-accent/8 px-3 py-2 text-caption leading-relaxed text-primary">
                    {tip}
                  </p>
                )}
                <div className="mt-4 border-t border-border pt-4">
                  <div className="text-caption uppercase tracking-wider text-muted-foreground">
                    Great for
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {treks.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full px-2.5 py-1 text-caption font-medium transition-colors ${selected ? "bg-accent/15 text-primary" : "bg-primary/5 text-primary/80"}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Trek-specific "best time to go" (region + altitude aware) ─────────── */
type Tier = "Ideal" | "Good" | "Tough" | "Avoid";
type SeasonInfo = {
  name: string;
  months: string;
  monthIdx: number[];
  icon: typeof Sun;
  tier: Tier;
  note: string;
};

function seasonPlan(a: Adventure): { seasons: SeasonInfo[]; regionName: string } {
  const region = regionFor(`${a.title} ${a.slug}`);
  const regionName = (region?.name || "the Himalaya").replace(/\s*\(Tibet\)/, "");
  const text = `${a.title} ${a.slug} ${a.category}`.toLowerCase();
  let maxAlt = 0;
  (a.itinerary ?? []).forEach((d) => {
    for (const m of `${d.title} ${d.description}`.matchAll(/(\d[\d,]{2,})\s*m\b/g)) {
      const n = Number(m[1].replace(/,/g, ""));
      if (n >= 1000 && n <= 6900 && n > maxAlt) maxAlt = n;
    }
  });
  const highPass = maxAlt >= 4500;
  const rainShadow = region?.id === "mustang" || region?.id === "dolpo";
  const wildlife = /chitwan|bardia|safari|jungle|wildlife/.test(text);
  const kailash = region?.id === "kailash";
  const culture =
    !wildlife &&
    !kailash &&
    (region?.id === "kathmandu" || region?.id === "pokhara" || (/tour/.test(a.category.toLowerCase()) && !rainShadow));

  const trek = a.title;
  const S = (name: string, months: string, monthIdx: number[], icon: typeof Sun, tier: Tier, note: string): SeasonInfo => ({ name, months, monthIdx, icon, tier, note });
  const SPRING: [string, string, number[], typeof Sun] = ["Spring", "Mar – May", [2, 3, 4], Leaf];
  const AUTUMN: [string, string, number[], typeof Sun] = ["Autumn", "Sep – Nov", [8, 9, 10], Sun];
  const MONSOON: [string, string, number[], typeof Sun] = ["Monsoon", "Jun – Aug", [5, 6, 7], CloudRain];
  const WINTER: [string, string, number[], typeof Sun] = ["Winter", "Dec – Feb", [11, 0, 1], Snowflake];

  let seasons: SeasonInfo[];
  if (wildlife) {
    seasons = [
      S(...SPRING, "Good", `Warm and dry with good sightings before the summer heat builds.`),
      S(...AUTUMN, "Ideal", `Post-monsoon greenery, pleasant temperatures and the most active wildlife.`),
      S(...MONSOON, "Avoid", `Hot, humid and prone to flooding; tall grass drops sightings sharply.`),
      S(...WINTER, "Ideal", `Cool, dry mornings and superb rhino and bird viewing — the prime safari season.`),
    ];
  } else if (kailash) {
    seasons = [
      S(...SPRING, "Good", `Late spring opens the route as the plateau thaws; May is a popular start.`),
      S(...AUTUMN, "Good", `Early autumn brings clear, stable weather before winter shuts the passes.`),
      S(...MONSOON, "Ideal", `The main pilgrimage window — the Tibetan plateau sits in the rain shadow, so Jun–Aug is warm, dry and fully open.`),
      S(...WINTER, "Avoid", `The plateau and the Dolma La are snowbound and closed — the yatra does not run.`),
    ];
  } else if (rainShadow) {
    seasons = [
      S(...SPRING, "Ideal", `Clear, dry and increasingly warm across the trans-Himalayan desert of ${regionName}.`),
      S(...AUTUMN, "Ideal", `Stable weather and golden light over the arid canyons and walled villages.`),
      S(...MONSOON, "Good", `A rare summer option: ${regionName} lies in the Himalayan rain shadow, so it stays dry and trekkable while the rest of Nepal is wet.`),
      S(...WINTER, "Tough", `Bitterly cold and often snowbound at altitude; upper sections may be closed.`),
    ];
  } else if (culture) {
    seasons = [
      S(...SPRING, "Ideal", `Warm, clear days — perfect for heritage sites, lakes and mountain viewpoints.`),
      S(...AUTUMN, "Ideal", `Festival season with crisp air and the year's sharpest mountain panoramas.`),
      S(...MONSOON, "Good", `Lush and quiet with occasional showers; sights stay open and crowds thin out.`),
      S(...WINTER, "Good", `Cool and clear in the valleys — very comfortable for sightseeing and short hikes.`),
    ];
  } else if (highPass) {
    seasons = [
      S(...SPRING, "Ideal", `Warming days, rhododendron forests in bloom on the lower trail, and the high passes usually clear of deep snow — a prime window for ${trek}.`),
      S(...AUTUMN, "Ideal", `The classic Himalayan season: crystal-clear skies, the sharpest mountain views of the year and firm, dry trails over the pass.`),
      S(...MONSOON, "Avoid", `Cloud and rain hide the peaks, trails turn slippery and leech-prone, and mountain flights are often delayed — ${regionName} is not a rain-shadow area.`),
      S(...WINTER, "Tough", `Empty trails and clear skies, but severe cold and heavy snow can block the high pass — only for experienced, well-equipped teams.`),
    ];
  } else {
    seasons = [
      S(...SPRING, "Ideal", `Rhododendrons in bloom, warm days and clear mornings across ${regionName}.`),
      S(...AUTUMN, "Ideal", `Stable weather and the sharpest Himalayan views of the year — the most reliable window.`),
      S(...MONSOON, "Tough", `Green and quiet but wet and cloudy; doable at these lower altitudes with rain gear, though views come and go.`),
      S(...WINTER, "Good", `Cold but crisp and crowd-free — comfortable at ${trek}'s lower elevations with warm layers.`),
    ];
  }
  return { seasons, regionName };
}

const TIER_STYLE: Record<Tier, { badge: string; strip: string; phrase: string }> = {
  Ideal: { badge: "bg-accent text-primary", strip: "bg-accent", phrase: "a prime time to go" },
  Good: { badge: "bg-emerald-500/15 text-emerald-600", strip: "bg-accent/55", phrase: "a good time to go" },
  Tough: { badge: "bg-amber-500/15 text-amber-600", strip: "bg-accent/25", phrase: "trekkable but challenging" },
  Avoid: { badge: "bg-rose-500/12 text-rose-500", strip: "bg-primary/10", phrase: "not the ideal window" },
};

export function TrekSeasons({ adventure }: { adventure: Adventure }) {
  const { seasons, regionName } = seasonPlan(adventure);
  const nowMonth = new Date().getMonth();
  const current = seasons.find((s) => s.monthIdx.includes(nowMonth));
  const ideal = seasons.filter((s) => s.tier === "Ideal").map((s) => s.name);
  const tierOfMonth = (i: number) => seasons.find((s) => s.monthIdx.includes(i))?.tier ?? "Avoid";

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">When to go</div>
          <h2 className="mt-4 text-balance font-display text-h2 font-medium text-primary">
            Best time for {adventure.title}
          </h2>
          <p className="mt-4 text-subtitle text-muted-foreground">
            Season by season for this route across {regionName} — not a generic calendar.
          </p>
          {current && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-small font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Right now it's {current.name} — {TIER_STYLE[current.tier].phrase} for this trek
              {ideal.length ? ` · best: ${ideal.join(" & ")}` : ""}
            </div>
          )}
        </div>

        {/* Month strip, shaded by how good each month is for THIS trek */}
        <div className="reveal mx-auto mt-10 flex max-w-content justify-center gap-1.5">
          {MONTHS.map((m, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`relative h-16 rounded-lg ${TIER_STYLE[tierOfMonth(i)].strip}`}>
                {i === nowMonth && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow">
                    Now
                  </span>
                )}
              </div>
              <div className="mt-2 text-caption font-medium text-muted-foreground">{m}</div>
            </div>
          ))}
        </div>
        <div className="reveal mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-caption text-muted-foreground">
          {(["Ideal", "Good", "Tough", "Avoid"] as Tier[]).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${TIER_STYLE[t].strip}`} /> {t}
            </span>
          ))}
        </div>

        <div className="reveal stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {seasons.map(({ icon: Icon, name, months, tier, note }) => (
            <div
              key={name}
              className={`flex flex-col rounded-2xl border bg-white p-6 ${
                tier === "Ideal" ? "border-accent/40 shadow-glass" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${tier === "Ideal" ? "bg-accent text-primary" : "bg-primary/10 text-primary"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${TIER_STYLE[tier].badge}`}>
                  {tier}
                </span>
              </div>
              <div className="mt-4 font-display text-xl text-primary">{name}</div>
              <div className="mt-1 text-caption uppercase tracking-wider text-muted-foreground">{months}</div>
              <p className="mt-3 text-small leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Packing list ────────────────────────────── */
const PACKING = [
  { icon: Shirt, title: "Layers", items: ["Base layers (merino)", "Insulated down jacket", "Waterproof shell", "Fleece mid-layer", "Trekking trousers"] },
  { icon: Footprints, title: "Footwear", items: ["Broken-in trekking boots", "Camp shoes / sandals", "Wool socks (3–4 pairs)", "Gaiters (higher routes)"] },
  { icon: Compass, title: "Gear", items: ["30–40L daypack", "Trekking poles", "Headlamp + spare batteries", "Sunglasses (UV cat. 3–4)", "Reusable water bottle"] },
  { icon: HeartPulse, title: "Essentials", items: ["Sunscreen + lip balm SPF50", "Personal first-aid + blister care", "Water purification", "Passport, permits, insurance"] },
];
export function PackingList() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-reading">
            <div className="eyebrow">Come prepared</div>
            <h2 className="mt-4 font-display text-h2 font-medium text-primary">What to pack</h2>
          </div>
          <p className="max-w-md text-small text-muted-foreground">
            <Backpack className="mb-1 mr-1 inline h-4 w-4 text-accent" />
            A starting checklist — we send a tailored list on booking, and duffels + down jackets can be rented in Kathmandu.
          </p>
        </div>
        <div className="reveal stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKING.map(({ icon: Icon, title, items }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-xl text-primary">{title}</div>
              <ul className="mt-3 space-y-2">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-small text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Meet your team (Sherpa-led) ───────────────────── */
export function MeetYourTeam() {
  const pts = [
    { icon: MountainSnow, t: "Local Sherpa guides", d: "Born in the mountains, government-licensed, 10+ years on every route." },
    { icon: Award, t: "Wilderness-first-aid trained", d: "Oxygen, satellite comms and a trained medic on higher trips." },
    { icon: HeartPulse, t: "One team, start to finish", d: "The same crew from airport pickup to summit — no hand-offs." },
  ];
  return (
    <section className="bg-primary py-20 lg:py-28 text-white">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">Who leads you</div>
          <h2 className="mt-4 font-display text-h2 font-medium">Meet your Sherpa team</h2>
          <p className="mt-4 text-subtitle text-white/70">
            You're never with a stranger. Every trip is led by a certified local guide who grew up under these mountains.
          </p>
        </div>
        <div className="reveal stagger mt-12 grid gap-5 sm:grid-cols-3">
          {pts.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl glass p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-xl">{t}</div>
              <p className="mt-2 text-small leading-relaxed text-white/65">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────── FAQs ───────────────────────────────── */
const FAQS = [
  { q: "How fit do I need to be?", a: "You should be comfortable walking 5–7 hours a day on consecutive days with a daypack. No technical skill is needed for treks; climbing peaks include training. Regular cardio in the months before helps most." },
  { q: "How do you handle altitude?", a: "Our itineraries are built around gradual ascent and acclimatization days. Guides monitor you daily, carry oxygen and a pulse oximeter on higher trips, and will always prioritize your safety over the schedule." },
  { q: "What's included in the price?", a: "See the What's Included section above — typically permits, guides, porters, accommodation, most meals on trek and airport transfers. International flights, insurance and personal gear are excluded." },
  { q: "When and how do I pay?", a: "Choose Pay Later and we confirm availability first — no upfront payment. A deposit secures your dates; the balance is due before departure. We'll send secure payment options after confirming." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 5 days before departure. Within 5 days, deposit terms apply — we'll always work with you on rescheduling where we can." },
];
export function AdventureFaq({ bare }: { bare?: boolean } = {}) {
  const body = (
    <>
      {bare ? (
        <div>
          <div className="eyebrow">Good to know</div>
          <h2 className="mt-3 font-display text-h3 font-medium text-primary">Frequently asked</h2>
        </div>
      ) : (
        <div className="reveal text-center">
          <div className="eyebrow">Good to know</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">Frequently asked</h2>
        </div>
      )}
      <div className={`reveal ${bare ? "mt-8" : "mt-12"} space-y-3`}>
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-border bg-white p-5 [&_summary]:cursor-pointer"
          >
            <summary className="flex items-center justify-between gap-4 font-display text-lg text-primary marker:content-none">
              {f.q}
              <span className="text-accent transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-small leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
  if (bare) return <div>{body}</div>;
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-reading px-6">{body}</div>
    </section>
  );
}

/* ─────────────────────────── Related adventures ────────────────────────── */
export function RelatedAdventures({
  items,
  category,
  currentSlug,
}: {
  items: Adventure[];
  category: string;
  currentSlug: string;
}) {
  const related = items
    .filter((a) => a.category === category && a.slug !== currentSlug)
    .slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mb-12 max-w-reading">
          <div className="eyebrow">Keep exploring</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">You might also love</h2>
        </div>
        <div className="reveal stagger grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <AdventureCard key={a.id} adventure={a} label={a.category} />
          ))}
        </div>
      </div>
    </section>
  );
}
