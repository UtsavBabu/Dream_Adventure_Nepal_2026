import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Mountain, Phone, Mail, MessageCircle } from "lucide-react";

import { adventuresQuery, siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { VideoBackdrop } from "@/components/site/video-backdrop";
import { AdventureListing } from "@/components/site/adventure-listing";
import { BookingForm } from "@/components/site/booking-form";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Tours — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Discover Nepal's cultural treasures: UNESCO heritage tours, Everest helicopter flights, wildlife safaris, and lakeside getaways.",
      },
      { property: "og:title", content: "Cultural Tours — Dream Adventure Nepal" },
      {
        property: "og:description",
        content:
          "Discover Nepal's soul. UNESCO heritage sites, wildlife safaris, and sunrise flights.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
    context.queryClient.ensureQueryData(adventuresQuery);
  },
  component: ToursPage,
});

function ToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <ToursContent />
    </Suspense>
  );
}

function ToursContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const { data: adventures } = useSuspenseQuery(adventuresQuery);
  useReveal();

  const tours = adventures.filter((a) => a.category === "Tour");
  const [selected, setSelected] = useState(tours[0] ?? null);
  const contact =
    (settings?.contact as { email?: string; phone?: string; whatsapp?: string }) ?? {};
  const esewa = (settings?.esewa as { qr_url?: string }) ?? {};
  const pageHero =
    (settings?.tours_page as {
      hero_image?: string;
      hero_video?: string;
      badge?: string;
      title?: string;
      title_highlight?: string;
      subtitle?: string;
    }) ?? {};
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;

  const whatsappUrl = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in a tour. Can you share more details?`)}`
    : null;

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      {vis("tours_hero") && (
        <section className="relative flex min-h-[60vh] lg:min-h-[65vh] items-end overflow-hidden bg-primary">
          <div className="absolute inset-0">
            <VideoBackdrop
              poster={
                pageHero.hero_image ||
                "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920"
              }
              src={pageHero.hero_video || "https://assets.mixkit.co/videos/5009/5009-1080.mp4"}
              alt="Nepal cultural tours"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-16 pt-36">
            <div className="reveal max-w-reading">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                <Mountain className="h-3.5 w-3.5" /> {pageHero.badge || "Cultural Tours"}
              </div>
              <h1 className="mt-5 text-balance font-display text-display font-medium text-white">
                {pageHero.title || "Discover Nepal's"}{" "}
                <em className="text-accent">{pageHero.title_highlight || "soul"}</em>
              </h1>
              <p className="mt-6 max-w-reading text-subtitle text-white/75">
                {pageHero.subtitle ||
                  "UNESCO heritage sites, wildlife safaris, sunrise flights, and lakeside relaxation — curated by local experts."}
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  "UNESCO World Heritage",
                  "Wildlife safaris",
                  "Private local guides",
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

      {/* Tour listing (shared floating-filter + grid) */}
      {vis("tours_listing") && (
        <AdventureListing items={adventures} category="Tour" label="Tour" />
      )}

      {/* Booking section */}
      {vis("tours_booking") && (
        <section id="booking" className="bg-primary py-20 lg:py-28 text-white">
          <div className="mx-auto max-w-content px-6">
            <div className="reveal text-center">
              <div className="eyebrow">
                Book a Tour
              </div>
              <h2 className="mt-4 font-display text-h2 font-medium">
                Ready for an adventure?
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Select a tour below and we'll confirm your booking within 24 hours.
              </p>
            </div>

            {tours.length > 1 && (
              <div className="reveal mt-10 flex justify-center">
                <select
                  value={selected?.id ?? ""}
                  onChange={(e) => setSelected(tours.find((t) => t.id === e.target.value) ?? null)}
                  className="w-full max-w-md rounded-full border border-white/20 bg-white/5 px-6 py-3 text-white backdrop-blur focus:border-accent focus:outline-none"
                >
                  {tours.map((t) => (
                    <option key={t.id} value={t.id} className="bg-primary text-white">
                      {t.title} — {t.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selected && (
              <div className="reveal mt-14 grid gap-10 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
                    <BookingForm
                      adventureId={selected.id}
                      adventureTitle={selected.title}
                      adventureSlug={selected.slug}
                      price={selected.price}
                      esewaQrUrl={esewa.qr_url}
                    />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="sticky top-24 space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <h3 className="font-display text-lg text-white">Quick Contact</h3>
                      <p className="mt-2 text-sm text-white/50">
                        Prefer to reach out directly? We're here to help.
                      </p>
                      <div className="mt-5 space-y-3">
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl bg-green-500/20 p-3 text-sm font-medium text-green-300 transition hover:bg-green-500/30"
                          >
                            <MessageCircle className="h-5 w-5" />
                            Chat on WhatsApp
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-sm text-white/70 transition hover:bg-white/10"
                          >
                            <Phone className="h-5 w-5" />
                            {contact.phone}
                          </a>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-3 rounded-xl bg-white/5 p-3 text-sm text-white/70 transition hover:bg-white/10"
                          >
                            <Mail className="h-5 w-5" />
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </div>

                    {selected && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h3 className="font-display text-lg text-white">{selected.title}</h3>
                        <div className="mt-4 space-y-2 text-sm text-white/60">
                          <div className="flex justify-between">
                            <span>Price</span>
                            <span className="font-medium text-accent">{selected.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deposit required</span>
                            <span className="font-medium text-white">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cancellation</span>
                            <span className="font-medium text-white">Free 14 days</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="reveal mt-10 text-center text-sm text-white/40">
              We reply within 2 hours. No commitment, no pressure — just honest answers.
            </div>
          </div>
        </section>
      )}

      {vis("cta") && <CtaBlock settings={settings} />}
      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
