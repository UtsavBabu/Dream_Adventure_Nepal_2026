import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Building2,
  Camera,
  Compass,
  CreditCard,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Mountain,
  MessageSquare,
  Settings,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Dream Adventure Nepal" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/adventures", label: "Adventures", icon: Mountain },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/team", label: "Our Team", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: Building2 },
  { to: "/admin/guides", label: "Guides", icon: Compass },
  { to: "/admin/places", label: "Places", icon: MapPin },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/hero", label: "Hero Section", icon: Video },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bootstrapping, setBootstrapping] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    }
    check();
  }, []);

  async function claimAdmin() {
    setBootstrapping(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: u.user.id, role: "admin" });
    setBootstrapping(false);
    if (error) {
      toast.error("Could not claim admin — an admin may already exist.");
      return;
    }
    toast.success("You're now admin.");
    setIsAdmin(true);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (isAdmin === null) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface p-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-elegant">
          <Camera className="mx-auto h-10 w-10 text-accent" />
          <h1 className="mt-4 font-display text-2xl text-primary">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No admin exists yet, or you're not one. If this is the first signup, claim admin below.
          </p>
          <button
            disabled={bootstrapping}
            onClick={claimAdmin}
            className="mt-6 w-full rounded-full btn-hero py-3 text-sm font-semibold"
          >
            {bootstrapping ? "Claiming…" : "Claim admin role"}
          </button>
          <button
            onClick={signOut}
            className="mt-3 w-full text-xs text-muted-foreground hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen bg-surface lg:grid-cols-[260px_1fr]">
      <aside className="hidden overflow-y-auto border-r border-border bg-primary text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <Link to="/" className="font-display text-lg">
            Dream Adventure Nepal
          </Link>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Admin Studio</div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                  active
                    ? "bg-accent text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="m-3 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/70 hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <main className="overflow-y-auto p-6 sm:p-10">
        <Outlet />
      </main>
    </div>
  );
}
