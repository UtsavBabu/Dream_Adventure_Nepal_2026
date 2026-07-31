import { Mountain } from "lucide-react";
import type { Guide } from "@/lib/site-data";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function Guides({ items }: { items: Guide[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Our Guides
          </div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Expert local guides
          </h2>
          <p className="mt-4 text-subtitle text-muted-foreground">
            Every guide is a certified professional with deep knowledge of Nepal's trails, culture
            and safety protocols.
          </p>
        </div>

        <div className="reveal mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((guide) => (
            <div
              key={guide.id}
              className="flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-glass"
            >
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary text-2xl font-display text-white">
                {initials(guide.name)}
              </div>
              <h3 className="mt-5 font-display text-xl text-primary">{guide.name}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-accent">
                <Mountain className="h-3.5 w-3.5" />
                {guide.speciality}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
