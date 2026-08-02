import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MountainSnow } from "lucide-react";

/**
 * Cinematic route transition: a navy "mountain curtain" that lifts to reveal the
 * new page on every navigation. Skips the very first load (the intro loader owns
 * that) and disables under prefers-reduced-motion.
 */
export function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [show, setShow] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 850);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150] overflow-hidden">
      <div className="page-wipe absolute inset-0 bg-primary">
        {/* mountain range along the lower edge, leading the lift */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-40 w-full"
        >
          <path
            d="M0,200 L180,70 L340,130 L520,40 L700,120 L880,50 L1080,120 L1260,60 L1440,110 L1440,200 Z"
            fill="color-mix(in oklab, white 8%, var(--primary))"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3" style={{ animation: "wipeMarkIn 0.5s ease-out both" }}>
            <MountainSnow className="h-9 w-9 text-accent" />
            <span className="text-caption uppercase tracking-[0.3em] text-white/60">
              Dream Adventure Nepal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
