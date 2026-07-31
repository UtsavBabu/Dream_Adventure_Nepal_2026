import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Building2,
  Compass,
  CreditCard,
  Mail,
  MapPin,
  Mountain,
  MessageSquare,
  Image,
  Settings,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const [counts, setCounts] = useState({
    adventures: 0,
    testimonials: 0,
    gallery: 0,
    team: 0,
    guides: 0,
    messages: 0,
    bookings: 0,
    payments: 0,
    places: 0,
  });
  useEffect(() => {
    (async () => {
      const [a, t, g, m, d, msg, b, p, pl] = await Promise.all([
        supabase.from("adventures").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("guides").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("id", { count: "exact", head: true }),
        supabase.from("places").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        adventures: a.count ?? 0,
        testimonials: t.count ?? 0,
        gallery: g.count ?? 0,
        team: m.count ?? 0,
        guides: d.count ?? 0,
        messages: msg.count ?? 0,
        bookings: b.count ?? 0,
        payments: p.count ?? 0,
        places: pl.count ?? 0,
      });
    })();
  }, []);

  const tiles = [
    { label: "Adventures", count: counts.adventures, icon: Mountain, to: "/admin/adventures" },
    {
      label: "Testimonials",
      count: counts.testimonials,
      icon: MessageSquare,
      to: "/admin/testimonials",
    },
    { label: "Our Team", count: counts.team, icon: Users, to: "/admin/team" },
    { label: "Bookings", count: counts.bookings, icon: Building2, to: "/admin/bookings" },
    { label: "Payments", count: counts.payments, icon: CreditCard, to: "/admin/payments" },
    { label: "Places", count: counts.places, icon: MapPin, to: "/admin/places" },
    { label: "Guides", count: counts.guides, icon: Compass, to: "/admin/guides" },
    { label: "Messages", count: counts.messages, icon: Mail, to: "/admin/messages" },
    { label: "Gallery", count: counts.gallery, icon: Image, to: "/admin/gallery" },
    { label: "Site Settings", count: null, icon: Settings, to: "/admin/settings" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="eyebrow">Studio</div>
      <h1 className="mt-2 font-display text-4xl text-primary">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Edit every section of your site from here.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={t.to}
            className="group rounded-3xl bg-white p-6 shadow-glass transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <t.icon className="h-7 w-7 text-accent" />
            <div className="mt-5 font-display text-2xl text-primary">{t.count ?? "·"}</div>
            <div className="text-sm text-muted-foreground">{t.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
