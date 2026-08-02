import { MapPin } from "lucide-react";
import { NEPAL_PATH, NEPAL_REGIONS, NEPAL_VIEWBOX, regionFor } from "@/lib/nepal-geo";

/**
 * "You are here" — a small real map of Nepal with this adventure's region
 * pinned, shown on the detail page. Renders nothing if the region is unknown.
 */
export function RegionLocator({ title, slug }: { title: string; slug: string }) {
  const region = regionFor(`${title} ${slug}`);
  if (!region) return null;
  const { w, h } = NEPAL_VIEWBOX;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:flex md:items-center md:gap-8">
      <div className="relative w-full shrink-0 md:w-1/2" style={{ aspectRatio: `${w} / ${h}` }}>
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 h-full w-full">
          <path
            d={NEPAL_PATH}
            fill="#e8eef5"
            stroke="#cbd5e1"
            strokeWidth="1.4"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {NEPAL_REGIONS.filter((r) => r.id !== region.id).map((r) => (
            <circle key={r.id} cx={r.x} cy={r.y} r="5" fill="#c3cfdd" />
          ))}
        </svg>
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(region.x / w) * 100}%`, top: `${(region.y / h) * 100}%` }}
        >
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-accent/40" />
            <span className="relative h-3.5 w-3.5 rounded-full bg-accent shadow-glow ring-2 ring-white" />
          </span>
        </span>
      </div>

      <div className="mt-5 md:mt-0">
        <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-4 w-4 text-accent" /> Where in Nepal
        </div>
        <h3 className="mt-2 font-display text-h3 font-medium text-primary">{region.name}</h3>
        <p className="mt-2 text-body leading-relaxed text-muted-foreground">{region.blurb}</p>
      </div>
    </div>
  );
}
