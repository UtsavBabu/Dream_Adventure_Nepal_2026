import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { SiteSettings } from "@/lib/site-data";
import { ContactForm } from "@/components/site/contact-form";

export function CtaBlock({ settings }: { settings: SiteSettings }) {
  const c = settings.cta ?? {};
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-primary py-28 text-white">
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=1920')",
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

      <div className="reveal mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Get In Touch
            </div>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] sm:text-5xl lg:text-6xl">
              {c.title}
            </h2>
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
  return (
    <footer className="bg-primary-deep py-16 text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-display text-2xl text-white">
            {nav.logo ?? "Dream Adventure Nepal"}
          </div>
          <p className="mt-3 max-w-md text-sm">{f.tagline}</p>
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
            {(nav.links ?? []).slice(0, 5).map((l: { label: string; href: string }) => (
              l.href.startsWith("#") ? (
                <a key={l.label} href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.href as any} className="hover:text-white">
                  {l.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-6 pt-6 text-xs text-white/40">
        {f.copyright}
      </div>
    </footer>
  );
}
