import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Building2,
  Camera,
  Compass,
  CreditCard,
  Eye,
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
  { to: "/admin/visibility", label: "Visibility", icon: Eye },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
            className="mt-6 w-full rounded-full btn-primary py-3 text-sm font-semibold"
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
    <div className="flex min-h-screen flex-col lg:grid lg:h-screen lg:grid-cols-[260px_1fr] bg-surface">
      {/* Mobile Admin Header */}
      <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-white lg:hidden">
        <div>
          <Link to="/" className="font-display text-base text-white">
            Dream Adventure Nepal
          </Link>
          <div className="text-[9px] uppercase tracking-[0.2em] text-white/50">Admin Studio</div>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={mobileNavOpen ? "Close menu" : "Open admin menu"}
        >
          {mobileNavOpen ? <LogOut className="h-5 w-5 rotate-180" /> : <LayoutDashboard className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative flex w-4/5 max-w-xs flex-col bg-primary p-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 pt-2">
              <div>
                <span className="font-display text-base">Admin Navigation</span>
                <div className="text-[10px] text-white/50">Select a section</div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto py-4">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
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
              className="mt-auto flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
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

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-full">
        <Outlet />
      </main>
    </div>
  );
}
