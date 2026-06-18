import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

type NavLinkItem = { label: string; href: string };

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const isHash = href.includes("#");
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-white/85 transition-colors hover:text-white"
    >
      {label}
    </a>
  );
}

export function SiteNavbar({ settings }: { settings: SiteSettings }) {
  const navCfg = settings.nav as Record<string, unknown> | undefined;
  const cta = (navCfg?.cta as string) || "Plan My Trip";
  const links: NavLinkItem[] = [
    { label: "Home", href: "/" },
    { label: "Treks", href: "/treks" },
    { label: "Expeditions", href: "/expeditions" },
    { label: "Tours", href: "/tours" },
    { label: "About Us", href: "/#about" },
    { label: "Contact Us", href: "/#contact" },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const logoUrl = (navCfg?.logo_url as string) || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-white">
          {logoUrl ? (
            <img src={logoUrl} alt="Dream Adventure Nepal" className="h-20 w-auto" />
          ) : (
            <span className="font-display text-xl text-white">Dream Adventure Nepal</span>
          )}
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l: { label: string; href: string }) => (
            <NavLink key={l.label} href={l.href} label={l.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/#contact"
            className="hidden rounded-full btn-hero px-5 py-2.5 text-sm font-semibold lg:inline-flex"
          >
            {cta}
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full glass p-2 text-white lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-3 rounded-2xl glass-nav p-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l: { label: string; href: string }) => (
              <NavLink key={l.label} href={l.href} label={l.label} onClick={() => setOpen(false)} />
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full btn-hero px-5 py-3 text-center text-sm font-semibold"
            >
              {cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
