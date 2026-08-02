import { useEffect } from "react";

/**
 * Adds `.in` to `.reveal` elements as they enter the viewport (drives the
 * fade-up animation). Robust by design: reveals anything already on screen at
 * mount, uses an IntersectionObserver for the smooth case, AND keeps a passive
 * scroll/resize fallback so a fast scroll can never leave a section stuck at
 * opacity:0. Falls back to revealing everything where IO is unavailable.
 */
export function useReveal() {
  useEffect(() => {
    const scan = () => Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    const reveal = (el: Element) => el.classList.add("in");
    if (!scan().length) return;

    if (typeof IntersectionObserver === "undefined") {
      scan().forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    scan().forEach((el) => io.observe(el));

    // Fallback: reveal anything within (or above) the viewport — catches fast
    // scrolls the observer skips, and above-the-fold content on mount.
    let scheduled = false;
    const check = () => {
      scheduled = false;
      const remaining = scan();
      for (const el of remaining) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95) reveal(el);
      }
      if (!document.querySelector(".reveal:not(.in)")) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(check);
    };

    check(); // mount: reveal what's already visible
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}
