import { useMemo } from "react";
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
} from "lucide-react";
import type { Adventure, SiteSettings } from "@/lib/site-data";
import { AdventureCard } from "@/components/site/adventure-card";

/* ─────────────────────────── Trust badges band ─────────────────────────── */
export function AdventureTrust({ settings }: { settings: SiteSettings }) {
  const legal = (settings?.legal ?? {}) as { registration_no?: string };
  const hero = (settings?.hero ?? {}) as { stats?: Array<{ label: string; value: string }> };
  const rating = hero.stats?.find((s) => /rating/i.test(s.label))?.value ?? "4.9/5";
  const items = [
    { icon: ShieldCheck, label: "Nepal Tourism Board licensed" },
    { icon: Star, label: `${rating} traveler rating` },
    { icon: BadgeCheck, label: legal.registration_no ? `Reg. ${legal.registration_no}` : "Registered operator" },
    { icon: HeartPulse, label: "Free cancellation · 14 days" },
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

/* ─────────────── Elevation profile (derived from itinerary) ─────────────── */
type Day = { day: number; title: string; description: string };

export function ElevationProfile({ itinerary, difficulty }: { itinerary: Day[]; difficulty: string }) {
  const points = useMemo(() => {
    if (!itinerary?.length) return [];
    let last = 0;
    const raw = itinerary.map((d) => {
      const nums = [...`${d.title} ${d.description}`.matchAll(/(\d[\d,]{2,})\s*m\b/g)]
        .map((m) => Number(m[1].replace(/,/g, "")))
        .filter((n) => n >= 1000 && n <= 9000);
      const alt = nums.length ? Math.max(...nums) : null;
      if (alt) last = alt;
      return { day: d.day, alt: alt ?? last };
    });
    return raw.filter((p) => p.alt > 0);
  }, [itinerary]);

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

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-reading">
            <div className="eyebrow">Altitude &amp; difficulty</div>
            <h2 className="mt-4 font-display text-h2 font-medium text-primary">The climb, day by day</h2>
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

        <div className="reveal overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-glass sm:p-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Elevation profile">
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
            {points.map((p, i) => (
              <circle key={i} cx={x(i)} cy={y(p.alt)} r={i === peakIdx ? 6 : 3} fill={i === peakIdx ? "#FF8C32" : "#0B2341"} />
            ))}
            <text x={x(peakIdx)} y={y(max) - 14} textAnchor="middle" className="fill-primary" fontSize="20" fontWeight="600">
              {max.toLocaleString()}m
            </text>
          </svg>
          <div className="mt-2 flex justify-between px-2 text-caption text-muted-foreground">
            <span>Day 1</span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-accent" /> Elevation derived from the itinerary
            </span>
            <span>Day {points[points.length - 1].day}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Best season ─────────────────────────────── */
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const SEASONS = [
  { icon: Leaf, name: "Spring", months: "Mar – May", note: "Rhododendron blooms, clear mornings, warm days.", best: true },
  { icon: Sun, name: "Autumn", months: "Sep – Nov", note: "The classic season — stable weather, the sharpest views.", best: true },
  { icon: CloudRain, name: "Monsoon", months: "Jun – Aug", note: "Green and quiet; rain in the lowlands, best for rain-shadow trails.", best: false },
  { icon: Snowflake, name: "Winter", months: "Dec – Feb", note: "Crisp, empty trails; cold at altitude, some passes closed.", best: false },
];
export function BestSeason() {
  const bestMonths = new Set([2, 3, 4, 8, 9, 10]); // Mar–May, Sep–Nov (0-indexed)
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">When to go</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">Best season to travel</h2>
        </div>
        <div className="reveal mx-auto mt-10 flex max-w-reading justify-center gap-1.5">
          {MONTHS.map((m, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`h-16 rounded-lg ${bestMonths.has(i) ? "bg-accent" : "bg-primary/10"}`} />
              <div className="mt-2 text-caption font-medium text-muted-foreground">{m}</div>
            </div>
          ))}
        </div>
        <div className="reveal mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map(({ icon: Icon, name, months, note, best }) => (
            <div key={name} className={`rounded-2xl border p-6 ${best ? "border-accent/40 bg-white shadow-glass" : "border-border bg-white"}`}>
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${best ? "bg-accent text-primary" : "bg-primary/10 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-display text-xl text-primary">{name}</span>
                {best && <span className="badge !px-2.5 !py-1 !text-[10px]">Best</span>}
              </div>
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
        <div className="reveal mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="reveal mt-12 grid gap-5 sm:grid-cols-3">
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
  { q: "What is your cancellation policy?", a: "Free cancellation up to 14 days before departure. Within 14 days, deposit terms apply — we'll always work with you on rescheduling where we can." },
];
export function AdventureFaq() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-reading px-6">
        <div className="reveal text-center">
          <div className="eyebrow">Good to know</div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">Frequently asked</h2>
        </div>
        <div className="reveal mt-12 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-white p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 font-display text-lg text-primary marker:content-none">
                {f.q}
                <span className="text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-small leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
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
        <div className="reveal grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <AdventureCard key={a.id} adventure={a} label={a.category} />
          ))}
        </div>
      </div>
    </section>
  );
}
