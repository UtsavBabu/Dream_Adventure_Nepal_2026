import { ArrowUpRight, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Adventure } from "@/lib/site-data";

// Single source of truth for the adventure card used on the homepage,
// the treks/expeditions/tours listings, and anywhere else.
export function AdventureCard({ adventure: a, label }: { adventure: Adventure; label?: string }) {
  return (
    <Link
      to="/adventures/$slug"
      params={{ slug: a.slug }}
      className="group card-elevate block overflow-hidden rounded-3xl bg-white shadow-glass ring-1 ring-black/[0.04] transition-shadow hover:ring-2 hover:ring-accent/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={a.image_url || undefined}
          alt={a.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
            {a.difficulty}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <div className="mb-3 flex items-center gap-3 text-xs text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {a.duration}
            </span>
            <span>•</span>
            <span>{label ?? a.category}</span>
          </div>
          <h3 className="font-display text-2xl font-medium leading-tight">{a.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/75">{a.description}</p>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/55">From</div>
              <div className="font-display text-xl text-accent">{a.price}</div>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
