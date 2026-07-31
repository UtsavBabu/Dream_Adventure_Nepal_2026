import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

type NavLinkItem = { label: string; href: string };

const LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Treks", href: "/treks" },
  { label: "Expeditions", href: "/expeditions" },
  { label: "Tours", href: "/tours" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="group relative py-1 text-small font-medium text-white/85 transition-colors hover:text-white"
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-accent transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </a>
  );
}

export function SiteNavbar({ settings }: { settings: SiteSettings }) {
  const navCfg = settings.nav as Record<string, unknown> | undefined;
  const cta = (navCfg?.cta as string) || "Plan My Trip";
  const logoUrl = (navCfg?.logo_url as string) || null;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (href: string) => {
    if (href.includes("#")) return false; // in-page anchors: hover-only
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-2.5" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-white" aria-label="Dream Adventure Nepal — home">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Dream Adventure Nepal"
              className={`w-auto transition-all duration-500 ${scrolled ? "h-12" : "h-16"}`}
            />
          ) : (
            <span className="font-display text-h3 text-white">Dream Adventure Nepal</span>
          )}
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.label} href={l.href} label={l.label} active={isActive(l.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/contact"
            className="hidden rounded-full btn-hero px-6 py-3 text-small font-semibold lg:inline-flex"
          >
            {cta}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full glass p-2.5 text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-3 rounded-2xl glass-nav p-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-xl px-3 py-3 text-small font-medium transition-colors ${
                  isActive(l.href) ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full btn-hero px-5 py-3 text-center text-small font-semibold"
            >
              {cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
