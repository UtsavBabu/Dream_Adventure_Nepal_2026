import { useEffect, useRef, useState } from "react";

/**
 * A small compass ring that trails the cursor (with easing) and enlarges +
 * spins faster over interactive elements. Desktop / fine-pointer only, off for
 * reduced-motion, and it keeps the native cursor so inputs stay usable.
 */
export function CursorFollower() {
  const ring = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let running = false;

    const startLoop = () => {
      if (running) return;
      running = true;
      loop();
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      startLoop();
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest("a,button,[role='button'],input,select,textarea,label");
      ring.current?.classList.toggle("cursor-ring--active", interactive);
    };
    const loop = () => {
      const dx = tx - rx;
      const dy = ty - ry;
      rx += dx * 0.18;
      ry += dy * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      }
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    startLoop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ring} aria-hidden className="cursor-ring">
      <span className="cursor-ring__needle" />
    </div>
  );
}
