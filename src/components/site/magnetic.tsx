import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

/**
 * Wraps a CTA so it drifts toward the cursor (magnetic hover), easing back on
 * leave. Pure inline-style writes — no re-render. Disabled on touch devices and
 * for reduced-motion users, where it renders as a plain inline-block.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const on = useRef(false);

  useEffect(() => {
    on.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const onMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el || !on.current) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </span>
  );
}
