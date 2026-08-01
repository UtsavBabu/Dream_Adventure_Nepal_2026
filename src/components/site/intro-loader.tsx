import { useEffect, useState } from "react";
import { MountainSnow } from "lucide-react";

/** Cinematic brand intro — shows once per session, then fades out. */
export function IntroLoader() {
  const [phase, setPhase] = useState<"hidden" | "showing" | "leaving">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem("dan-intro-seen")) return;
    setPhase("showing");
    const t1 = setTimeout(() => setPhase("leaving"), 1400);
    const t2 = setTimeout(() => {
      sessionStorage.setItem("dan-intro-seen", "1");
      setPhase("hidden");
    }, 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] grid place-items-center bg-primary-deep transition-opacity duration-700 ease-out ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div
          className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent"
          style={{ animation: "introRise 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <MountainSnow className="h-8 w-8" />
        </div>
        <div
          className="font-display text-2xl font-medium text-white"
          style={{ animation: "introRise 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
        >
          Dream Adventure Nepal
        </div>
        <div
          className="text-caption uppercase tracking-[0.3em] text-white/60"
          style={{ animation: "introRise 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
        >
          Preparing your Himalayan journey…
        </div>
        <div className="mt-1 h-0.5 w-44 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-full origin-left bg-accent"
            style={{ animation: "introBar 1.4s cubic-bezier(0.16,1,0.3,1) forwards" }}
          />
        </div>
      </div>
    </div>
  );
}
