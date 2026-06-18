import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ArrowUpRight, Clock, Mountain } from "lucide-react";

import { adventuresQuery, siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/treks")({
  head: () => ({
    meta: [
      { title: "Treks — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Explore our Himalayan treks: Everest Base Camp, Annapurna Circuit, Langtang Valley, and more. Expert-led trekking adventures in Nepal.",
      },
      { property: "og:title", content: "Himalayan Treks — Dream Adventure Nepal" },
      {
        property: "og:description",
        content:
          "Walk among the giants. Himalayan trekking adventures led by local Sherpa experts.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
    context.queryClient.ensureQueryData(adventuresQuery);
  },
  component: TreksPage,
});

function TreksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <TreksContent />
    </Suspense>
  );
}

function TreksContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: adventures } = useSuspenseQuery(adventuresQuery);
  useReveal();

  const treks = adventures.filter((a) => a.category === "Trek");

  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar settings={settings} />

      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end bg-primary">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Himalayan treks"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="reveal max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <Mountain className="h-3.5 w-3.5" /> Himalayan Treks
            </div>
            <h1 className="mt-5 font-display text-5xl font-medium text-white sm:text-6xl lg:text-7xl">
              Walk among the <em className="text-accent">giants</em>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/70">
              From Everest Base Camp to the Annapurna Circuit — our treks take you deep into the
              world's most dramatic mountain scenery.
            </p>
          </div>
        </div>
      </section>

      {/* Trek listing */}
      <section className="bg-surface py-28">
        <div className="mx-auto max-w-7xl px-6">
          {treks.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No treks available yet. Check back soon.
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {treks.map((a, i) => (
                <Link
                  key={a.id}
                  to="/adventures/$slug"
                  params={{ slug: a.slug }}
                  className="reveal group card-elevate block overflow-hidden rounded-3xl bg-white shadow-glass"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={a.image_url || null}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "var(--gradient-card)" }}
                    />
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
                        <span>Trek</span>
                      </div>
                      <h3 className="font-display text-2xl font-medium leading-tight">{a.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/75">{a.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-white/55">
                            From
                          </div>
                          <div className="font-display text-xl text-accent">{a.price}</div>
                        </div>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBlock settings={settings} />
      <SiteFooter settings={settings} />
    </main>
  );
}
