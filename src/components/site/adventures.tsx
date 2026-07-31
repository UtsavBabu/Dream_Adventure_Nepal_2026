import { Mountain, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Adventure } from "@/lib/site-data";
import { AdventureCard } from "@/components/site/adventure-card";

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

function ViewAll({ href, label, dark }: { href: string; label: string; dark?: boolean }) {
  return (
    <Link
      to={href as string}
      className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-6 py-3 text-small font-semibold transition ${
        dark
          ? "border-white/25 text-white hover:bg-white/10"
          : "border-border text-primary hover:border-primary"
      }`}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function AdventureSection({
  items,
  category,
  align = "center",
  limit,
  viewAllHref,
  tone = "light",
}: {
  items: Adventure[];
  category: string;
  align?: "center" | "left";
  limit?: number;
  viewAllHref?: string;
  tone?: "light" | "dark";
}) {
  const cfg = sectionConfig[category];
  if (!cfg || items.length === 0) return null;

  const shown = limit ? items.slice(0, limit) : items;
  const dark = tone === "dark";
  const centered = align === "center";
  const viewAllLabel = `View all ${cfg.label.toLowerCase()}`;

  const Header = (
    <>
      <div
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] ${
          dark ? "bg-white/10 text-accent" : "bg-accent/10 text-accent"
        }`}
      >
        <Mountain className="h-3.5 w-3.5" /> {cfg.label}
      </div>
      <h2
        className={`mt-6 text-balance font-display text-h2 font-medium ${dark ? "text-white" : "text-primary"}`}
        dangerouslySetInnerHTML={{ __html: cfg.title }}
      />
      <p className={`mt-5 text-subtitle ${dark ? "text-white/70" : "text-muted-foreground"}`}>
        {cfg.subtitle}
      </p>
    </>
  );

  return (
    <section
      id={`${category.toLowerCase()}s`}
      className={`relative py-20 lg:py-28 ${dark ? "bg-primary text-white" : "bg-surface"}`}
    >
      <div id={category.toLowerCase()} className="sr-only" />
      <div className="mx-auto max-w-content px-6">
        {centered ? (
          <div className="reveal mx-auto max-w-reading text-center">{Header}</div>
        ) : (
          <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">{Header}</div>
            {viewAllHref && (
              <div className="hidden md:block">
                <ViewAll href={viewAllHref} label={viewAllLabel} dark={dark} />
              </div>
            )}
          </div>
        )}

        <div className="reveal mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <AdventureCard key={a.id} adventure={a} label={category} />
          ))}
        </div>

        {viewAllHref && (
          <div className={`reveal mt-12 ${centered ? "text-center" : "md:hidden"}`}>
            <ViewAll href={viewAllHref} label={viewAllLabel} dark={dark} />
          </div>
        )}
      </div>
    </section>
  );
}

// Keep old name for backwards compatibility
export const Adventures = AdventureSection;
