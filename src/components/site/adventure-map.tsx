import { MapPin } from "lucide-react";

export function AdventureMap({ embedUrl, title }: { embedUrl: string; title: string }) {
  if (!embedUrl) return null;
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal text-center">
          <div className="text-caption font-semibold uppercase tracking-[0.22em] text-accent">
            Location
          </div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">Where you'll be</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore the region of <span className="font-medium text-primary">{title}</span> on the
            map.
          </p>
        </div>
        <div className="reveal mt-10 overflow-hidden rounded-3xl shadow-elegant">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${title}`}
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="reveal mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-accent" />
          <span>Click and drag to explore the region</span>
        </div>
      </div>
    </section>
  );
}
