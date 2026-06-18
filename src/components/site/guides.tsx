import type { Guide } from "@/lib/site-data";

export function Guides({ items }: { items: Guide[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Our Guides
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium text-primary sm:text-5xl">
            Expert local guides
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every guide is a certified professional with deep knowledge of Nepal's trails, culture
            and safety protocols.
          </p>
        </div>

        <div className="reveal mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((guide) => (
            <div key={guide.id} className="group text-center">
              <div className="mx-auto h-48 w-48 overflow-hidden rounded-full shadow-elegant transition group-hover:shadow-lg">
                <img
                  src={guide.avatar_url}
                  alt={guide.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-xl text-primary">{guide.name}</h3>
              <div className="mt-1 text-sm font-medium text-accent">{guide.speciality}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
