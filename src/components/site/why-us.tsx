import { Award, HeartHandshake, ShieldCheck, Sparkles, Tag, LifeBuoy } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

const icons = [Award, Sparkles, ShieldCheck, HeartHandshake, Tag, LifeBuoy];

export function WhyUs({ settings }: { settings: SiteSettings }) {
  const a = settings.about ?? {};
  const features: Array<{ title: string; desc: string }> = a.features ?? [];
  return (
    <section id="about" className="relative bg-primary py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {a.eyebrow}
            </div>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
              {a.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">{a.subtitle}</p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
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
                    <div className="mt-5 font-display text-xl">{f.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
