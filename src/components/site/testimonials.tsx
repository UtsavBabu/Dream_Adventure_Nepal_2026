import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/site-data";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  if (items.length === 0) return null;
  const t = items[idx];
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);
  return (
    <section className="bg-surface py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Traveler Stories
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium text-primary sm:text-5xl">
            Words from the trail
          </h2>
        </div>

        <div className="reveal mt-14 grid items-center gap-10 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant">
              <img src={t.avatar_url || null} alt={t.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden h-20 w-20 place-items-center rounded-2xl bg-accent text-white sm:grid">
              <Quote className="h-9 w-9" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <blockquote className="mt-6 font-display text-2xl leading-snug text-primary sm:text-3xl lg:text-4xl">
              "{t.review}"
            </blockquote>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <div className="font-display text-xl text-primary">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.country}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-primary transition hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white transition hover:bg-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Story ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-accent" : "w-4 bg-primary/15"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
