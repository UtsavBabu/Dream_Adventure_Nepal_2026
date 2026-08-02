import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { Mountain } from "lucide-react";

import { adventuresQuery, siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { VideoBackdrop } from "@/components/site/video-backdrop";
import { AdventureListing } from "@/components/site/adventure-listing";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/treks")({
  head: () => ({
    meta: [
      { title: "Treks — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Explore our Himalayan treks: Everest Base Camp, Annapurna Circuit, Langtang Valley, and more. Filter by difficulty, duration and budget.",
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

  const treks = useMemo(() => adventures.filter((a) => a.category === "Trek"), [adventures]);
  const pageHero =
    (settings?.treks_page as {
      hero_image?: string;
      hero_video?: string;
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
      {vis("treks_hero") && (
        <section className="relative flex min-h-[60vh] items-end bg-primary">
          <div className="absolute inset-0">
            <VideoBackdrop
              poster={
                pageHero.hero_image ||
                "https://images.pexels.com/photos/733162/pexels-photo-733162.jpeg?auto=compress&cs=tinysrgb&w=1920"
              }
              src={pageHero.hero_video || "https://assets.mixkit.co/videos/3371/3371-1080.mp4"}
              alt="Himalayan treks"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-32 pt-32">
            <div className="reveal max-w-reading">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                <Mountain className="h-3.5 w-3.5" /> {pageHero.badge || "Himalayan Treks"}
              </div>
              <h1 className="mt-5 text-balance font-display text-display font-medium text-white">
                {pageHero.title || "Walk among the"}{" "}
                <em className="text-accent">{pageHero.title_highlight || "giants"}</em>
              </h1>
              <p className="mt-6 max-w-reading text-subtitle text-white/75">
                {pageHero.subtitle ||
                  "From Everest Base Camp to the Annapurna Circuit — our treks take you deep into the world's most dramatic mountain scenery."}
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  `${treks.length} Himalayan routes`,
                  "Everest · Annapurna · Langtang · Manaslu",
                  "Sherpa-led",
                  "Nepal Tourism Board licensed",
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

      {/* Listing (shared floating-filter + grid) */}
      {vis("treks_listing") && (
        <AdventureListing items={adventures} category="Trek" label="Trek" />
      )}

      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
