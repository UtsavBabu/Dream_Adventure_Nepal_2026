import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ArrowLeft, Clock, Mountain, MapPin } from "lucide-react";

import { adventureBySlugQuery, adventurePlacesQuery, siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import {
  AdventureItinerary,
  AdventureHighlights,
  AdventureIncludesExcludes,
} from "@/components/site/adventure-itinerary";
import { AdventurePlaces } from "@/components/site/adventure-places";
import { AdventureMap } from "@/components/site/adventure-map";
import { AdventureBooking } from "@/components/site/adventure-booking";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/adventures/$slug")({
  loader: async ({ context, params }) => {
    const adventure = await context.queryClient.ensureQueryData(adventureBySlugQuery(params.slug));
    await context.queryClient.ensureQueryData(siteSettingsQuery);
    await context.queryClient.ensureQueryData(adventurePlacesQuery(adventure.id));
    return adventure;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.title} — Dream Adventure Nepal` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:image", content: loaderData.image_url },
      ],
    };
  },
  component: AdventureDetailPage,
});

function AdventureDetailPage() {
  const { slug } = Route.useParams();
  const { data: adventure } = useSuspenseQuery(adventureBySlugQuery(slug));
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: adventurePlaces } = useSuspenseQuery(adventurePlacesQuery(adventure.id));
  useReveal();

  const contact =
    (settings?.contact as { email?: string; phone?: string; whatsapp?: string }) ?? {};
  const esewa = (settings?.esewa as { qr_url?: string }) ?? {};

  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar settings={settings} />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end">
        <div className="absolute inset-0">
          <img
            src={adventure.image_url || null}
            alt={adventure.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all adventures
          </Link>
          <div className="reveal">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {adventure.category}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium text-white sm:text-6xl lg:text-7xl">
              {adventure.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/70">{adventure.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> {adventure.duration}
              </span>
              <span className="inline-flex items-center gap-2">
                <Mountain className="h-4 w-4" /> {adventure.difficulty}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {adventure.category}
              </span>
              <span className="font-display text-2xl text-accent">{adventure.price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      {adventure.long_description && (
        <section className="bg-white py-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="reveal">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Overview
              </div>
              <h2 className="mt-4 font-display text-3xl font-medium text-primary">
                About this adventure
              </h2>
              <div className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
                {adventure.long_description}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      <AdventureHighlights items={adventure.highlights ?? []} />

      {/* Itinerary */}
      <AdventureItinerary days={adventure.itinerary ?? []} />

      {/* Places */}
      <AdventurePlaces places={adventurePlaces ?? []} />

      {/* Map */}
      <AdventureMap embedUrl={adventure.map_embed_url ?? ""} title={adventure.title} />

      {/* Includes / Excludes */}
      <AdventureIncludesExcludes
        includes={adventure.includes ?? []}
        excludes={adventure.excludes ?? []}
      />

      {/* Booking */}
      <AdventureBooking adventure={adventure} contact={contact} esewaQrUrl={esewa.qr_url} />

      {/* Footer CTA */}
      <CtaBlock settings={settings} />
      <SiteFooter settings={settings} />
    </main>
  );
}
