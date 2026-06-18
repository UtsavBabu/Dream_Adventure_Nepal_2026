import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ArrowUpRight, Clock, Mountain, Phone, Mail, MessageCircle } from "lucide-react";

import { adventuresQuery, siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
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
        <section className="relative flex min-h-[60vh] items-end bg-primary">
          <div className="absolute inset-0">
            <img
              src={
                pageHero.hero_image ||
                "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920"
              }
              alt="Nepal cultural tours"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20">
            <div className="reveal max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <Mountain className="h-3.5 w-3.5" /> {pageHero.badge || "Cultural Tours"}
              </div>
              <h1 className="mt-5 font-display text-5xl font-medium text-white sm:text-6xl lg:text-7xl">
                {pageHero.title || "Discover Nepal's"}{" "}
                <em className="text-accent">{pageHero.title_highlight || "soul"}</em>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/70">
                {pageHero.subtitle ||
                  "UNESCO heritage sites, wildlife safaris, sunrise flights, and lakeside relaxation — curated by local experts."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tour listing */}
      {vis("tours_listing") && (
        <section className="bg-surface py-28">
          <div className="mx-auto max-w-7xl px-6">
            {tours.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                No tours available yet. Check back soon.
              </div>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((a, i) => (
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
                          <span>Tour</span>
                        </div>
                        <h3 className="font-display text-2xl font-medium leading-tight">
                          {a.title}
                        </h3>
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
      )}

      {/* Booking section */}
      {vis("tours_booking") && (
        <section id="booking" className="bg-primary py-28 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Book a Tour
              </div>
              <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
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
                            <span className="font-medium text-white">20%</span>
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
