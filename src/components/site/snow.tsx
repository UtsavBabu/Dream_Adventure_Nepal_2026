import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Lightweight canvas snow — drifting flakes over the hero. Skipped on phones and
 * for reduced-motion users so it never costs LCP or battery. Pauses when the tab
 * is hidden. Purely decorative (aria-hidden, pointer-events-none).
 */
export function Snow({ count = 70 }: { count?: number }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth ?? window.innerWidth;
      h = parent?.clientHeight ?? window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    type Flake = { x: number; y: number; r: number; sp: number; sway: number; ph: number; o: number };
    const flakes: Flake[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,
      sp: Math.random() * 0.5 + 0.25,
      sway: Math.random() * 0.6 + 0.2,
      ph: Math.random() * Math.PI * 2,
      o: Math.random() * 0.5 + 0.35,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.sp;
        f.ph += 0.01;
        f.x += Math.sin(f.ph) * f.sway;
        if (f.y > h + 4) {
          f.y = -4;
          f.x = Math.random() * w;
        }
        if (f.x > w + 4) f.x = -4;
        else if (f.x < -4) f.x = w + 4;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count, isMobile]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
