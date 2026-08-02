/**
 * A soaring eagle silhouette that glides slowly across a section, arcing,
 * bobbing and flapping. Purely decorative (aria-hidden, pointer-events-none) and
 * sits behind content; all motion pauses under prefers-reduced-motion (global
 * CSS), leaving it parked off-screen.
 */
export function EagleFlight({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-4 z-0 h-48 overflow-hidden ${className}`}
    >
      <div className="eagle-glide absolute left-0 top-10">
        <div className="eagle-bob">
          <svg
            width="72"
            viewBox="0 0 160 72"
            className="eagle-flap fill-white/75 drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
          >
            <path d="M80 6 C77 12 83 12 80 18 C72 13 60 13 52 20 C42 9 24 8 5 26 C17 24 26 26 35 29 C26 29 20 33 33 33 C41 30 49 31 58 32 C66 34 73 37 80 42 C87 37 94 34 102 32 C111 31 119 30 127 33 C140 33 134 29 125 29 C134 26 143 24 155 26 C136 8 118 9 108 20 C100 13 88 13 80 18 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
