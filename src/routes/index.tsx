import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import {
  adventuresQuery,
  galleryQuery,
  guidesQuery,
  siteSettingsQuery,
  testimonialsQuery,
  teamMembersQuery,
} from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { Hero } from "@/components/site/hero";
import { AdventureSection } from "@/components/site/adventures";
import { WhyUs } from "@/components/site/why-us";
import { Testimonials } from "@/components/site/testimonials";
import { OurTeam } from "@/components/site/our-team";
import { Guides } from "@/components/site/guides";
import { Gallery } from "@/components/site/gallery";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dream Adventure Nepal — Himalayan Treks, Expeditions & Heli Tours" },
      {
        name: "description",
        content:
          "Premium Himalayan adventures crafted by local Sherpa experts since 2005. Everest Base Camp, Annapurna, Mustang, expeditions and helicopter tours.",
      },
      { property: "og:title", content: "Dream Adventure Nepal — Beyond The Ordinary" },
      {
        property: "og:description",
        content: "Cinematic treks and expeditions in Nepal, led by local experts.",
      },
      {
        property: "og:image",
        content:
          "https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1920",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
    context.queryClient.ensureQueryData(adventuresQuery);
    context.queryClient.ensureQueryData(teamMembersQuery);
    context.queryClient.ensureQueryData(guidesQuery);
    context.queryClient.ensureQueryData(testimonialsQuery);
    context.queryClient.ensureQueryData(galleryQuery);
  },
  component: HomePage,
});

function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: adventures } = useSuspenseQuery(adventuresQuery);
  const { data: teamMembers } = useSuspenseQuery(teamMembersQuery);
  const { data: guides } = useSuspenseQuery(guidesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: gallery } = useSuspenseQuery(galleryQuery);
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;
  useReveal();

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}
      {vis("home_hero") && <Hero settings={settings} />}
      {vis("home_treks") && (
        <AdventureSection items={adventures.filter((a) => a.category === "Trek")} category="Trek" />
      )}
      {vis("home_expeditions") && (
        <AdventureSection
          items={adventures.filter((a) => a.category === "Expedition")}
          category="Expedition"
        />
      )}
      {vis("home_tours") && (
        <AdventureSection items={adventures.filter((a) => a.category === "Tour")} category="Tour" />
      )}
      {vis("home_why_us") && <WhyUs settings={settings} />}
      {vis("home_our_team") && <OurTeam items={teamMembers} />}
      {vis("home_guides") && <Guides items={guides} />}
      {vis("home_testimonials") && <Testimonials items={testimonials} />}
      {vis("home_gallery") && <Gallery items={gallery} />}
      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
