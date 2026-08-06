import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  MessagesSquare,
  BadgeCheck,
  Plane,
  ShieldCheck,
  Gauge,
} from "lucide-react";

import { siteSettingsQuery } from "@/lib/site-data";
import { useReveal } from "@/hooks/use-reveal";
import { SiteNavbar } from "@/components/site/site-navbar";
import { VideoBackdrop } from "@/components/site/video-backdrop";
import { CtaBlock, SiteFooter } from "@/components/site/footer-cta";

const WA = "https://wa.me/9779767832384";

type Activity = {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  level: string;
  season: string;
  desc: string;
  img: string;
};

const ACTIVITIES: Activity[] = [
  {
    slug: "bungee",
    name: "Bungee Jumping",
    tagline: "Freefall over a Himalayan gorge",
    location: "Kushma & The Last Resort",
    level: "Extreme",
    season: "Year-round",
    desc: "Leap from a suspension bridge high above a raging river. Kushma is the world's second-highest bungee at 228 m; The Last Resort plunges 160 m over the Bhote Koshi.",
    img: "/activities/bungee.jpg",
  },
  {
    slug: "paragliding",
    name: "Paragliding",
    tagline: "Soar beside the Annapurnas",
    location: "Sarangkot, Pokhara",
    level: "Beginner-friendly",
    season: "Sep – Apr",
    desc: "Launch from Sarangkot and glide over Phewa Lake with Machapuchare and the Annapurnas on the horizon. Tandem flights with certified pilots — no experience needed.",
    img: "/activities/paragliding.jpg",
  },
  {
    slug: "rafting",
    name: "White Water Rafting",
    tagline: "Ride glacier-fed rapids",
    location: "Trishuli · Bhote Koshi · Sun Koshi",
    level: "Moderate – Hard",
    season: "Sep – Nov · Mar – May",
    desc: "From the beginner-friendly Trishuli to the thundering Bhote Koshi and the multi-day Sun Koshi 'river of gold' — big whitewater through remote Himalayan gorges.",
    img: "/activities/rafting.jpg",
  },
  {
    slug: "kayaking",
    name: "Kayaking",
    tagline: "Paddle Nepal's wild rivers",
    location: "Seti · Trishuli · Sun Koshi",
    level: "Moderate",
    season: "Sep – Nov · Mar – May",
    desc: "Learn to roll on the gentle Seti or join a supported clinic on classic whitewater. Instruction, safety kayakers and all gear included.",
    img: "/activities/kayaking.jpg",
  },
  {
    slug: "zip-flyer",
    name: "Zip Flyer",
    tagline: "One of the world's steepest ziplines",
    location: "Sarangkot, Pokhara",
    level: "Moderate",
    season: "Year-round",
    desc: "Drop 600 m of vertical down a 1.8 km cable at up to 120 km/h — among the steepest, longest and fastest ziplines on earth, high above the Pokhara valley.",
    img: "/activities/zipline.jpg",
  },
  {
    slug: "canyoning",
    name: "Canyoning",
    tagline: "Abseil through waterfalls",
    location: "The Last Resort · Jalbire",
    level: "Moderate",
    season: "Sep – Jun",
    desc: "Rappel down cascading waterfalls, slide natural rock chutes and swim through turquoise pools in lush Himalayan canyons. Full gear and certified guides provided.",
    img: "/activities/canyoning.jpg",
  },
];

const STEPS = [
  { icon: MessagesSquare, t: "Tell us your thrill", d: "Message us the activities, dates and group size — or just say “surprise me.”" },
  { icon: BadgeCheck, t: "We book certified operators", d: "We arrange permits, gear, transfers, insurance and only vetted, safety-certified operators." },
  { icon: Plane, t: "Just show up", d: "Land in Kathmandu or Pokhara — your whole adventure is confirmed and ready to go." },
];

export const Route = createFileRoute("/adventures/")({
  head: () => ({
    meta: [
      { title: "Adventure Sports in Nepal — Bungee, Paragliding, Rafting & More" },
      {
        name: "description",
        content:
          "Bungee jumping, paragliding, white-water rafting, kayaking, zip-lining and canyoning across Nepal. Tell us what you want — we arrange and book every detail.",
      },
      { property: "og:title", content: "Adventure Sports in Nepal — Dream Adventure Nepal" },
      {
        property: "og:description",
        content: "Nepal's adrenaline, arranged for you: bungee, paragliding, rafting, kayaking and more.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(siteSettingsQuery);
  },
  component: AdventuresIndexPage,
});

function AdventuresIndexPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <AdventuresContent />
    </Suspense>
  );
}

function AdventuresContent() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery);
  const v = (settings?.section_visibility as Record<string, boolean>) ?? {};
  const vis = (id: string) => v[id] !== false;
  useReveal();

  return (
    <main className="min-h-screen bg-background">
      {vis("navbar") && <SiteNavbar settings={settings} />}

      {/* Hero */}
      <section className="relative flex min-h-[60vh] lg:min-h-[65vh] items-end overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <VideoBackdrop
            poster="/activities/hero.jpg"
            src="https://assets.mixkit.co/videos/51585/51585-1080.mp4"
            alt="Adventure sports in Nepal"
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-16 pt-36">
          <div className="reveal max-w-reading">
            <div className="eyebrow">Adrenaline · Nepal</div>
            <h1 className="mt-4 text-balance font-display text-display font-medium text-white">
              Feel the pulse of <span className="text-gradient-accent italic">Nepal</span>
            </h1>
            <p className="mt-5 max-w-xl text-subtitle text-white/80">
              Bungee, paragliding, rafting, kayaking, zip-lining and canyoning — the wildest ways to
              experience the Himalaya. Tell us what you want; <strong className="font-semibold text-white">we arrange and book every detail.</strong>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`${WA}?text=${encodeURIComponent("Hi Dream Adventure Nepal, I'd like to plan an adventure activity.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-glow inline-flex items-center gap-2 rounded-full btn-primary px-8 py-4 text-small font-semibold"
              >
                <MessageCircle className="h-4 w-4" /> Plan my adventure
              </a>
              <div className="flex flex-wrap gap-2 text-caption text-white/80">
                {["Certified operators", "All gear included", "We handle booking"].map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-content px-6">
          <div className="reveal mx-auto max-w-reading text-center">
            <div className="eyebrow">Choose your thrill</div>
            <h2 className="mt-4 font-display text-h2 font-medium text-primary">
              Nepal's adventure playground
            </h2>
            <p className="mt-4 text-subtitle text-muted-foreground">
              Every activity below is run by vetted, safety-certified operators — and booked, permitted
              and transferred by us.
            </p>
          </div>

          <div className="reveal stagger mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((a) => (
              <a
                key={a.slug}
                href={`${WA}?text=${encodeURIComponent(`Hi Dream Adventure Nepal, I'd like to book ${a.name} in Nepal.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group card-elevate relative block overflow-hidden rounded-3xl bg-primary shadow-glass"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
                  <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[450%]" />

                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur">
                      <Gauge className="h-3 w-3 text-accent" /> {a.level}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="inline-flex items-center gap-1.5 text-caption text-white/75">
                      <MapPin className="h-3.5 w-3.5 text-accent" /> {a.location}
                    </div>
                    <h3 className="mt-1.5 font-display text-2xl font-medium leading-tight">{a.name}</h3>
                    <p className="mt-1 text-small text-accent">{a.tagline}</p>
                    <p className="mt-3 max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                      {a.desc}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-caption text-white/60">Best: {a.season}</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary">
                        Request
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — we arrange it */}
      <section className="bg-primary py-20 text-white lg:py-28">
        <div className="mx-auto max-w-content px-6">
          <div className="reveal mx-auto max-w-reading text-center">
            <div className="eyebrow">Leave the logistics to us</div>
            <h2 className="mt-4 font-display text-h2 font-medium">We arrange your whole adventure</h2>
            <p className="mt-4 text-subtitle text-white/70">
              You bring the courage — we handle permits, gear, certified operators, transfers and
              insurance, and combine any activities into one seamless trip.
            </p>
          </div>
          <div className="reveal mt-14 grid gap-5 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, t, d }, i) => (
              <div key={t} className="rounded-2xl glass p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-h3 text-white/30">0{i + 1}</span>
                </div>
                <div className="mt-4 font-display text-xl">{t}</div>
                <p className="mt-2 text-small leading-relaxed text-white/65">{d}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-10 text-center">
            <a
              href={`${WA}?text=${encodeURIComponent("Hi Dream Adventure Nepal, I'd like to plan adventure activities.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full btn-primary px-8 py-4 text-small font-semibold"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp to book
            </a>
          </div>
        </div>
      </section>

      {vis("cta") && <CtaBlock settings={settings} />}

      {/* Photo credits (CC attribution) */}
      <div className="bg-background py-6">
        <p className="mx-auto max-w-content px-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          Adventure photography under Creative Commons: Pokhara paragliding © jeeheon (CC BY) · bungee ©
          graham.james.campbell (CC BY-SA) · rafting © Tips For Travellers (CC BY) · kayaking © xcDogs
          (CC BY) · zip flyer © jurvetson (CC BY) · canyoning © Colin Davis Studio (CC BY).
        </p>
      </div>

      {vis("footer") && <SiteFooter settings={settings} />}
    </main>
  );
}
