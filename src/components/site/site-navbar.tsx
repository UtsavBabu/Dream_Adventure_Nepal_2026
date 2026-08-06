import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";
import { Magnetic } from "@/components/site/magnetic";
import { GlobalSearch } from "@/components/site/global-search";

type NavLinkItem = { label: string; href: string };

const LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Treks", href: "/treks" },
  { label: "Expeditions", href: "/expeditions" },
  { label: "Tours", href: "/tours" },
  { label: "Adventures", href: "/adventures" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
    <Link
      to={href as string}
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
    </Link>
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close menu on Escape or screen resize
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-2.5" : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[110rem] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 text-white" aria-label="Dream Adventure Nepal — home">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Dream Adventure Nepal"
              className={`w-auto transition-all duration-500 ${scrolled ? "h-9 sm:h-12" : "h-11 sm:h-16"}`}
            />
          ) : (
            <span className="font-display text-lg sm:text-h3 text-white truncate max-w-[200px] sm:max-w-none">
              Dream Adventure Nepal
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.label} href={l.href} label={l.label} active={isActive(l.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <Magnetic strength={0.4} className="hidden lg:inline-block">
            <Link
              to="/contact"
              className="rounded-full btn-primary px-6 py-3 text-small font-semibold"
            >
              {cta}
            </Link>
          </Magnetic>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full glass p-2.5 text-white lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-[60px] z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative z-50 mx-4 mt-2 max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl glass-nav p-6 shadow-2xl lg:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.href as string}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                    isActive(l.href) ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full btn-primary px-5 py-3.5 text-center text-base font-semibold"
              >
                {cta}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
