import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { SiteSettings } from "@/lib/site-data";

const BG_IMAGE_1 =
  "https://images.pexels.com/photos/2403568/pexels-photo-2403568.jpeg?auto=compress&cs=tinysrgb&w=1600";
const BG_IMAGE_2 =
  "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1600";
const SPOTLIGHT_R = 260;

/** Reveals a second image inside a soft circular mask that trails the cursor. */
function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskUrl, setMaskUrl] = useState("");

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,1)");
    g.addColorStop(0.6, "rgba(255,255,255,0.75)");
    g.addColorStop(0.75, "rgba(255,255,255,0.4)");
    g.addColorStop(0.88, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();
    setMaskUrl(c.toDataURL());
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" style={{ display: "none" }} />
      <div
        className="pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${image}")`,
          opacity: maskUrl ? 1 : 0,
          maskImage: maskUrl ? `url(${maskUrl})` : undefined,
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : undefined,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />
    </>
  );
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const h = (settings.hero ?? {}) as Record<string, unknown>;
  const titlePre = (h.title_pre as string) || "Explore Nepal Beyond";
  const titleHighlight = (h.title_highlight as string) || "The Ordinary";
  const subtitle =
    (h.subtitle as string) ||
    "Breathtaking treks, mountain expeditions and cultural journeys crafted by local experts.";
  const ctaPrimary = (h.cta_primary as string) || "Start Your Journey";

  return (
    <section id="home" className="relative w-full overflow-hidden bg-black" style={{ height: "100dvh" }}>
      {/* Base image (z-10) with a slow Ken Burns zoom-out */}
      <div
        className="hero-zoom absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
      />

      {/* Cursor spotlight reveals a second view (client only) */}
      {mounted && <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />}

      {/* Legibility overlay */}
      <div className="absolute inset-0 z-40" style={{ background: "var(--gradient-hero)" }} aria-hidden />

      {/* Heading (z-50) */}
      <div className="pointer-events-none absolute inset-x-0 top-[16%] z-50 flex flex-col items-center px-5 text-center">
        <h1 className="leading-[0.95] text-white">
          <span
            className="hero-anim hero-reveal block font-display text-5xl font-normal italic text-accent sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
          >
            {titlePre}
          </span>
          <span
            className="hero-anim hero-reveal -mt-1 block text-5xl font-normal sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
          >
            {titleHighlight}
          </span>
        </h1>
        <p
          className="hero-anim hero-fade mt-6 max-w-md text-caption uppercase tracking-[0.25em] text-white/70"
          style={{ animationDelay: "0.6s" }}
        >
          Move your cursor · reveal the Himalaya
        </p>
      </div>

      {/* Bottom-left paragraph (z-50) */}
      <div
        className="hero-anim hero-fade absolute bottom-14 left-10 z-50 hidden max-w-[260px] sm:block md:left-14"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="text-sm leading-relaxed text-white/80">
          Every trail tells a story — from cliffside monasteries to glaciers older than memory,
          written across the roof of the world.
        </p>
      </div>

      {/* Bottom-right block + CTA (z-50) */}
      <div
        className="hero-anim hero-fade absolute bottom-10 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-24 sm:left-auto sm:right-10 sm:max-w-[280px] sm:gap-5 md:right-14"
        style={{ animationDelay: "0.85s" }}
      >
        <p className="whitespace-pre-line text-xs leading-relaxed text-white/80 sm:text-sm">
          {subtitle}
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-primary transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/30 active:scale-95"
        >
          {ctaPrimary} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
