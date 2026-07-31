import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock, Instagram, Facebook } from "lucide-react";

import { siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { ContactForm } from "@/components/site/contact-form";
import { SiteFooter } from "@/components/site/footer-cta";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Dream Adventure Nepal" },
      {
        name: "description",
        content:
          "Talk to a local expert about your Himalayan trek or expedition. Reach us by WhatsApp, phone or email — we reply within 24 hours.",
      },
      { property: "og:title", content: "Contact Dream Adventure Nepal" },
      {
        property: "og:description",
        content: "Plan your Nepal adventure with a local expert. WhatsApp, phone or email.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
  },
  component: ContactPage,
});

const FAQS = [
  {
    q: "When is the best time to trek in Nepal?",
    a: "Spring (March–May) and autumn (September–November) offer the clearest skies and most stable weather. We run trips year-round and will advise the best window for your chosen route.",
  },
  {
    q: "Do I need previous experience?",
    a: "Most treks need good fitness but no technical skill. Climbing expeditions like Island or Mera Peak include training; Ama Dablam requires prior high-altitude experience. Tell us your background and we'll match you to the right trip.",
  },
  {
    q: "How do permits and logistics work?",
    a: "We handle all permits (national park, TIMS, restricted-area where needed), domestic flights, guides, porters and accommodation. You just arrive in Kathmandu.",
  },
  {
    q: "How and when do I pay?",
    a: "Choose Pay Later and we confirm availability first — no upfront payment. A deposit secures your dates; the balance is due before departure. We'll send secure payment options after confirming.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 14 days before departure. Within 14 days, deposit terms apply — we'll always work with you on rescheduling where we can.",
  },
];

function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <ContactContent />
    </Suspense>
  );
}

function Method({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-accent/40 hover:shadow-glass">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-caption uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-medium text-primary">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}

function ContactContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  useReveal();

  const c = (settings?.contact ?? {}) as {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
  const social = (settings?.social ?? {}) as { instagram?: string; facebook?: string };
  const waNumber = c.whatsapp && !/0{6,}/.test(c.whatsapp) ? c.whatsapp : c.phone;
  const waUrl = waNumber
    ? `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hi! I'd like to plan a trip with Dream Adventure Nepal.",
      )}`
    : undefined;
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      <section className="relative flex min-h-[46vh] items-end bg-primary">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Kathmandu Himalaya"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-14 pt-32">
          <div className="reveal max-w-reading">
            <div className="text-caption font-semibold uppercase tracking-[0.22em] text-accent">
              Get In Touch
            </div>
            <h1 className="mt-4 text-balance font-display text-h1 font-medium text-white">
              Let's plan your adventure
            </h1>
            <p className="mt-5 max-w-reading text-subtitle text-white/75">
              Talk to a local expert — no pressure, just honest answers. We reply within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Methods + form */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto grid max-w-content gap-12 px-6 lg:grid-cols-2">
          <div className="reveal">
            <div className="grid gap-4 sm:grid-cols-2">
              {c.email && (
                <Method icon={Mail} label="Email" value={c.email} href={`mailto:${c.email}`} />
              )}
              {c.phone && (
                <Method icon={Phone} label="Phone" value={c.phone} href={`tel:${c.phone}`} />
              )}
              {waUrl && (
                <Method icon={MessageCircle} label="WhatsApp" value="Chat with us" href={waUrl} />
              )}
              {c.address && <Method icon={MapPin} label="Office" value={c.address} />}
            </div>

            <div className="mt-4 flex items-start gap-4 rounded-2xl border border-border bg-white p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-caption uppercase tracking-wider text-muted-foreground">
                  Business hours (NPT)
                </div>
                <div className="mt-1 text-sm text-primary">
                  Sun–Fri: 9:00 AM – 6:00 PM · Sat: by appointment
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Trekking emergencies: reachable 24/7 on WhatsApp
                </div>
              </div>
            </div>

            {(social.instagram || social.facebook) && (
              <div className="mt-6 flex items-center gap-3">
                <span className="text-caption uppercase tracking-wider text-muted-foreground">
                  Follow us
                </span>
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary transition hover:border-accent hover:text-accent"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary transition hover:border-accent hover:text-accent"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Form card (dark) */}
          <div className="reveal rounded-3xl bg-primary p-8 shadow-elegant">
            <h2 className="font-display text-h3 font-medium text-white">Send us a message</h2>
            <p className="mt-2 text-sm text-white/60">
              Tell us about your plans and we'll craft an itinerary for you.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-background">
        <div className="mx-auto max-w-content px-6 pb-24">
          <div className="overflow-hidden rounded-3xl border border-border shadow-glass">
            <iframe
              title="Dream Adventure Nepal — Kathmandu office"
              src="https://maps.google.com/maps?q=Thamel,%20Kathmandu,%20Nepal&z=14&output=embed"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-center text-caption text-muted-foreground">
            Approximate location (Thamel, Kathmandu) — exact office pin available on request.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-reading px-6">
          <div className="reveal text-center">
            <div className="text-caption font-semibold uppercase tracking-[0.22em] text-accent">
              FAQ
            </div>
            <h2 className="mt-4 font-display text-h2 font-medium text-primary">
              Before you reach out
            </h2>
          </div>
          <div className="reveal mt-12 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-white p-5 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-display text-lg text-primary marker:content-none">
                  {f.q}
                  <span className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
