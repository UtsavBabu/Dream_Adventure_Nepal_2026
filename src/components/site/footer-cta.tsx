import { BadgeCheck, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { SiteSettings } from "@/lib/site-data";
import { ContactForm } from "@/components/site/contact-form";
import { EagleFlight } from "@/components/site/eagle";
import { VideoBackdrop } from "@/components/site/video-backdrop";

// Absolute hrefs so every link works from any page (routes + home-section anchors).
const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "Treks", href: "/treks" },
  { label: "Expeditions", href: "/expeditions" },
  { label: "Tours", href: "/tours" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CTA_POSTER =
  "https://images.pexels.com/photos/1054289/pexels-photo-1054289.jpeg?auto=compress&cs=tinysrgb&w=1920";

export function CtaBlock({ settings }: { settings: SiteSettings }) {
  const c = (settings.cta ?? {}) as { title?: string; subtitle?: string; video_url?: string };
  const ctaVideo = c.video_url || "";
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-primary py-20 lg:py-28 text-white">
      {ctaVideo ? (
        // Owner-supplied eagle/scenery clip as the section background (CMS-managed).
        <>
          <div className="absolute inset-0 -z-10">
            <VideoBackdrop poster={CTA_POSTER} src={ctaVideo} alt="" />
          </div>
          <div className="absolute inset-0 -z-10 bg-primary/60" aria-hidden />
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-overlay)" }}
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 -z-10 opacity-40"
            style={{
              backgroundImage: `url('${CTA_POSTER}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-overlay)" }}
            aria-hidden
          />
          <EagleFlight />
        </>
      )}

      <div className="reveal mx-auto max-w-content px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="eyebrow">
              Get In Touch
            </div>
            <h2 className="mt-4 text-balance font-display text-h1 font-medium">{c.title}</h2>
            <p className="mt-5 text-lg text-white/70">{c.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`mailto:${settings.contact?.email ?? ""}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4" /> {settings.contact?.email ?? "Email us"}
              </a>
              <a
                href={`tel:${settings.contact?.phone ?? ""}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> {settings.contact?.phone ?? "Call us"}
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const f = settings.footer ?? {};
  const c = settings.contact ?? {};
  const nav = settings.nav ?? {};
  const social = settings.social ?? {};
  const legal = settings.legal ?? {};
  return (
    <footer className="bg-primary-deep py-16 text-white/70">
      <div className="mx-auto grid max-w-content gap-10 px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-display text-2xl text-white">
            {nav.logo ?? "Dream Adventure Nepal"}
          </div>
          <p className="mt-3 max-w-md text-sm">{f.tagline}</p>
          {(social.instagram || social.facebook) && (
            <div className="mt-5 flex items-center gap-3">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:bg-accent hover:border-accent"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:bg-accent hover:border-accent"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
          {legal.registration_no && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <BadgeCheck className="h-4 w-4 text-accent" />
              <span>
                Reg. No. {legal.registration_no}
                {legal.registrar ? ` · ${legal.registrar}` : ""}
              </span>
            </div>
          )}
        </div>
        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
            Contact
          </div>
          <div className="space-y-2 text-sm">
            {c.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                {c.email}
              </div>
            )}
            {c.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                {c.phone}
              </div>
            )}
            {c.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                {c.address}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
            Explore
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {FOOTER_NAV.map((l) =>
              l.href.includes("#") ? (
                <a key={l.label} href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.href as any} className="hover:text-white">
                  {l.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-content border-t border-white/10 px-6 pt-6 text-xs text-white/40">
        {f.copyright}
      </div>
    </footer>
  );
}
