import { MapPin } from "lucide-react";
import type { AdventurePlace } from "@/lib/site-data";

export function AdventurePlaces({
  places,
}: {
  places: (AdventurePlace & {
    place?: {
      id: string;
      name: string;
      description: string;
      image_url: string;
      lat: number | null;
      lng: number | null;
      type: string;
    };
  })[];
}) {
  if (!places || places.length === 0) return null;

  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Destinations
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium text-primary">
            Places you'll explore
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Every destination along your journey</p>
        </div>

        <div className="reveal mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((ap, i) => {
            const p = ap.place;
            if (!p) return null;
            return (
              <div
                key={ap.id || i}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-glass transition hover:-translate-y-1 hover:shadow-elegant"
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-48 w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-accent/5 to-primary/5">
                    <MapPin className="h-12 w-12 text-accent/30" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-lg">
                  {ap.day_number}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-primary">{p.name}</h3>
                  {p.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                  )}
                  {p.lat && p.lng && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-accent" />
                      <span>
                        {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
