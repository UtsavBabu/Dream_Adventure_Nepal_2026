import type { GalleryImage } from "@/lib/site-data";

export function Gallery({ items }: { items: GalleryImage[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section id="gallery" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-reading text-center">
          <div className="eyebrow">
            Gallery
          </div>
          <h2 className="mt-4 font-display text-h2 font-medium text-primary">
            Moments from the mountains
          </h2>
        </div>

        <div className="reveal mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((g, i) => (
            <figure
              key={g.id}
              className="group relative mb-5 break-inside-avoid overflow-hidden rounded-2xl"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={g.image_url}
                alt={g.caption}
                loading="lazy"
                className="w-full transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {g.caption && (
                <figcaption className="absolute inset-x-3 bottom-3 translate-y-4 rounded-2xl glass px-4 py-3 font-display text-base text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
