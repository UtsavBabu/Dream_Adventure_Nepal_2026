import { Award, HeartHandshake, ShieldCheck, Sparkles, Tag, LifeBuoy } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

const icons = [Award, Sparkles, ShieldCheck, HeartHandshake, Tag, LifeBuoy];

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1200";

const DEFAULT_STATS = [
  { value: "100+", label: "Happy travelers" },
  { value: "100%", label: "Local team" },
  { value: "24/7", label: "On-trip support" },
];

export function WhyUs({ settings }: { settings: SiteSettings }) {
  const a = settings.about ?? {};
  const features: Array<{ title: string; desc: string }> = a.features ?? [];
  const stats: Array<{ value: string; label: string }> = a.stats ?? DEFAULT_STATS;
  const image: string = a.image ?? DEFAULT_IMAGE;

  return (
    <section id="about" className="relative bg-primary py-28 text-white">
      <div className="mx-auto max-w-content px-6">
        {/* Editorial split: image + story */}
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant">
              <img src={image} alt="In the Nepal Himalaya" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-accent px-6 py-5 text-white shadow-glow sm:block">
              <div className="font-display text-h3 font-medium leading-none">20+</div>
              <div className="mt-1.5 text-caption uppercase tracking-wider text-white/85">
                Years guiding the Himalaya
              </div>
            </div>
          </div>

          <div className="reveal">
            <div className="text-caption font-semibold uppercase tracking-[0.22em] text-accent">
              {a.eyebrow}
            </div>
            <h2 className="mt-5 text-balance font-display text-h2 font-medium">{a.title}</h2>
            <p className="mt-6 text-subtitle leading-relaxed text-white/70">{a.subtitle}</p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-h3 font-medium leading-none text-accent">
                    {s.value}
                  </div>
                  <div className="mt-2 text-caption uppercase tracking-wider text-white/60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={f.title}
                className="reveal rounded-2xl glass p-6 transition-transform duration-500 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-display text-h3 text-[1.35rem]">{f.title}</div>
                <p className="mt-2 text-small leading-relaxed text-white/65">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
