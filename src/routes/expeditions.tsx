import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Mountain } from "lucide-react";

import { adventuresQuery, siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { AdventureCard } from "@/components/site/adventure-card";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/expeditions")({
  head: () => ({
    meta: [
      { title: "Expeditions — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Summit Nepal's finest peaks: Island Peak, Mera Peak, Ama Dablam, and more. Technical climbing expeditions led by certified Sherpa guides.",
      },
      { property: "og:title", content: "Climbing Expeditions — Dream Adventure Nepal" },
      {
        property: "og:description",
        content: "Summit your first 6,000m peak. Technical climbs led by certified Sherpa guides.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
    context.queryClient.ensureQueryData(adventuresQuery);
  },
  component: ExpeditionsPage,
});

function ExpeditionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <ExpeditionsContent />
    </Suspense>
  );
}

function ExpeditionsContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: adventures } = useSuspenseQuery(adventuresQuery);
  useReveal();

  const expeditions = adventures.filter((a) => a.category === "Expedition");
  const pageHero =
    (settings?.expeditions_page as {
      hero_image?: string;
      badge?: string;
      title?: string;
      title_highlight?: string;
      subtitle?: string;
    }) ?? {};
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      {vis("expeditions_hero") && (
        <section className="relative flex min-h-[60vh] items-end bg-primary">
          <div className="absolute inset-0">
            <img
              src={
                pageHero.hero_image ||
                "https://images.pexels.com/photos/2108850/pexels-photo-2108850.jpeg?auto=compress&cs=tinysrgb&w=1920"
              }
              alt="Climbing expeditions"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-28 pt-32">
            <div className="reveal max-w-reading">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                <Mountain className="h-3.5 w-3.5" /> {pageHero.badge || "Climbing Expeditions"}
              </div>
              <h1 className="mt-5 text-balance font-display text-display font-medium text-white">
                {pageHero.title || "Summit your first"}{" "}
                <em className="text-accent">{pageHero.title_highlight || "6,000m peak"}</em>
              </h1>
              <p className="mt-6 max-w-reading text-subtitle text-white/75">
                {pageHero.subtitle ||
                  "Technical climbs led by certified Sherpa guides. Island Peak, Mera Peak, Ama Dablam — your next milestone awaits."}
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  `${expeditions.length} flagship peaks`,
                  "6,000m+ summits",
                  "1:1 Sherpa on summit day",
                  "Certified & licensed",
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-caption font-medium text-white/90"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Expedition listing */}
      {vis("expeditions_listing") && (
        <section className="bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-content px-6">
            {expeditions.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                No expeditions available yet. Check back soon.
              </div>
            ) : (
              <div className="reveal grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {expeditions.map((a) => (
                  <AdventureCard key={a.id} adventure={a} label="Expedition" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
