import { Mountain } from "lucide-react";
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

export function AdventureSection({ items, category }: { items: Adventure[]; category: string }) {
  const cfg = sectionConfig[category];
  if (!cfg || items.length === 0) return null;

  return (
    <section id={`${category.toLowerCase()}s`} className="relative bg-surface py-28">
      <div id={category.toLowerCase()} className="sr-only" />

      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] text-accent">
            <Mountain className="h-3.5 w-3.5" /> {cfg.label}
          </div>
          <h2
            className="mt-6 text-balance font-display text-h2 font-medium text-primary"
            dangerouslySetInnerHTML={{ __html: cfg.title }}
          />
          <p className="mt-5 text-subtitle text-muted-foreground">{cfg.subtitle}</p>
        </div>

        <div className="reveal mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <AdventureCard key={a.id} adventure={a} label={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Keep old name for backwards compatibility
export const Adventures = AdventureSection;
