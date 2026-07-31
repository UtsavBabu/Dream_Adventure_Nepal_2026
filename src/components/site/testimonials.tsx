import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/site-data";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Traveler Stories
          </div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Words from the trail
          </h2>
        </div>

        <div className="reveal mt-14 flex flex-wrap justify-center gap-6">
          {items.map((t) => (
            <figure
              key={t.id}
              className="flex w-full flex-col rounded-3xl bg-white p-8 shadow-glass sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-accent/20" />
              </div>

              <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed text-primary">
                "{t.review}"
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-4 border-t border-border pt-5">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 font-display text-lg text-primary">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-display text-base text-primary">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.country}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
