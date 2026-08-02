import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up from 0 when it scrolls into view, preserving any
 * suffix/prefix (e.g. "100+", "4.9/5", "100%", "24/7"). Respects reduced-motion.
 */
export function CountUp({ value, duration = 1500 }: { value: string; duration?: number }) {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const rawNum = match ? match[2].replace(/,/g, "") : "";
  const suffix = match ? match[3] : "";
  const target = match ? parseFloat(rawNum) : NaN;
  const decimals = rawNum.includes(".") ? rawNum.split(".")[1].length : 0;

  const ref = useRef<HTMLSpanElement | null>(null);
  // Initialise to the real target so SSR / first paint never shows "0".
  // The animation resets to 0 and counts up only once scrolled into view.
  const [display, setDisplay] = useState(() => (Number.isNaN(target) ? 0 : target));

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(target * eased);
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  // Non-numeric values render verbatim.
  if (Number.isNaN(target)) return <span>{value}</span>;

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
