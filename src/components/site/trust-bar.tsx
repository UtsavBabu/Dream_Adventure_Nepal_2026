import { BadgeCheck, MountainSnow, ShieldCheck, Star } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

export function TrustBar({ settings }: { settings: SiteSettings }) {
  const legal = (settings.legal ?? {}) as { registration_no?: string };
  const hero = (settings.hero ?? {}) as { stats?: Array<{ label: string; value: string }> };
  const rating = hero.stats?.find((s) => /rating/i.test(s.label))?.value ?? "4.9/5";

  const items = [
    { icon: ShieldCheck, label: "Nepal Tourism Board Licensed" },
    legal.registration_no
      ? { icon: BadgeCheck, label: `Reg. No. ${legal.registration_no}` }
      : null,
    { icon: Star, label: `${rating} Traveler Rating` },
    { icon: MountainSnow, label: "100% Local Sherpa Team" },
  ].filter(Boolean) as Array<{ icon: typeof ShieldCheck; label: string }>;

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 sm:justify-between">
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2.5 text-small font-medium text-primary"
            >
              <Icon className="h-5 w-5 shrink-0 text-accent" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
