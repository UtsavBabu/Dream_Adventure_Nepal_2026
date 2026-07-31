import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";

import { siteSettingsQuery, teamMembersQuery, guidesQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { WhyUs } from "@/components/site/why-us";
import { OurTeam } from "@/components/site/our-team";
import { Guides } from "@/components/site/guides";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Two decades of Himalayan expertise. Meet the local, government-licensed team behind Dream Adventure Nepal and the values that guide every expedition.",
      },
      { property: "og:title", content: "About Dream Adventure Nepal" },
      {
        property: "og:description",
        content: "Local Sherpa-led experts crafting safe, authentic Himalayan adventures.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
    context.queryClient.ensureQueryData(teamMembersQuery);
    context.queryClient.ensureQueryData(guidesQuery);
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <AboutContent />
    </Suspense>
  );
}

function AboutContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: team } = useSuspenseQuery(teamMembersQuery);
  const { data: guides } = useSuspenseQuery(guidesQuery);
  useReveal();

  const legal = (settings?.legal ?? {}) as { registration_no?: string; registrar?: string };
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      <section className="relative flex min-h-[58vh] items-end bg-primary">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="The Nepal Himalaya"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-16 pt-32">
          <div className="reveal max-w-reading">
            <div className="text-caption font-semibold uppercase tracking-[0.22em] text-accent">
              Our Story
            </div>
            <h1 className="mt-4 text-balance font-display text-h1 font-medium text-white">
              Born under these mountains
            </h1>
            <p className="mt-5 max-w-reading text-subtitle text-white/75">
              For two decades we've guided travelers deep into the Himalaya — with the safety,
              local knowledge, and care you only get from the people who grew up here.
            </p>
            {legal.registration_no && (
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-caption text-white/80">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Reg. No. {legal.registration_no}
                {legal.registrar ? ` · ${legal.registrar}` : ""}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Story + stats + values (reused editorial About section) */}
      <WhyUs settings={settings} />

      {/* Team & guides */}
      <OurTeam items={team} />
      <Guides items={guides} />

      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
