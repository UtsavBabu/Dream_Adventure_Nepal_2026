import type { GalleryImage } from "@/lib/site-data";

export function Gallery({ items }: { items: GalleryImage[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section id="gallery" className="bg-background py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
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
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <figcaption className="p-5 font-display text-lg text-white">{g.caption}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
