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

  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;
  const contact =
    (settings?.contact as { email?: string; phone?: string; whatsapp?: string }) ?? {};
  const esewa = (settings?.esewa as { qr_url?: string }) ?? {};

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img
            src={adventure.image_url || undefined}
            alt={adventure.title}
            className="h-full w-full scale-105 object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-small font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all adventures
          </Link>
          <div className="reveal">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3.5 py-1 text-caption font-semibold uppercase tracking-wider text-white">
                {adventure.category}
              </span>
              <span className="rounded-full glass px-3.5 py-1 text-caption font-semibold uppercase tracking-wider text-white/90">
                {adventure.difficulty}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-h1 font-medium text-white">
              {adventure.title}
            </h1>
            <p className="mt-5 max-w-2xl text-subtitle text-white/75">{adventure.description}</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="#book"
                className="inline-flex items-center gap-2 rounded-full btn-hero px-8 py-4 text-small font-semibold"
              >
                Book This Adventure
              </a>
              <div className="inline-flex items-baseline gap-2 text-white">
                <span className="text-caption uppercase tracking-wider text-white/55">From</span>
                <span className="font-display text-h3 font-medium text-accent">
                  {adventure.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-6">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <Fact icon={Clock} label="Duration" value={adventure.duration} />
              <Fact icon={Mountain} label="Difficulty" value={adventure.difficulty} />
              <Fact icon={MapPin} label="Type" value={adventure.category} />
            </div>
            <a
              href="#book"
              className="inline-flex items-center gap-2 rounded-full btn-hero px-6 py-3 text-small font-semibold"
            >
              Book Now — {adventure.price}
            </a>
          </div>
        </div>
      </section>

      {/* Overview */}
      {vis("adventure_overview") && adventure.long_description && (
        <section className="bg-white py-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="reveal">
              <div className="text-caption font-semibold uppercase tracking-[0.22em] text-accent">
                Overview
              </div>
              <h2 className="mt-4 font-display text-h2 font-medium text-primary">
                About this adventure
              </h2>
              <div className="mt-6 whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                {adventure.long_description}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {vis("adventure_highlights") && <AdventureHighlights items={adventure.highlights ?? []} />}

      {/* Itinerary */}
      {vis("adventure_itinerary") && <AdventureItinerary days={adventure.itinerary ?? []} />}

      {/* Places */}
      {vis("adventure_places") && <AdventurePlaces places={adventurePlaces ?? []} />}

      {/* Map */}
      {vis("adventure_map") && (
        <AdventureMap embedUrl={adventure.map_embed_url ?? ""} title={adventure.title} />
      )}

      {/* Includes / Excludes */}
      {vis("adventure_includes") && (
        <AdventureIncludesExcludes
          includes={adventure.includes ?? []}
          excludes={adventure.excludes ?? []}
        />
      )}

      {/* Booking */}
      {vis("adventure_booking") && (
        <div id="book" className="scroll-mt-24">
          <AdventureBooking adventure={adventure} contact={contact} esewaQrUrl={esewa.qr_url} />
        </div>
      )}

      {/* Footer CTA */}
      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-caption uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-small font-semibold text-primary">{value}</div>
      </div>
    </div>
  );
}
