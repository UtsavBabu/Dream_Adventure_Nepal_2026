import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * PageHero — wrapper for all sub-page hero sections (Treks, Expeditions, Tours, etc.)
 * Keeps everything (video + content) invisible until the video's first frame is ready,
 * then reveals it all at once. No poster image is ever shown when a video src is
 * provided — the section just stays bg-primary (dark) until the video plays.
 */
export function PageHero({
  poster,
  src,
  alt = "",
  className = "",
  children,
}: {
  poster: string;
  src?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readyCalledRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);

  const showVideo = !reduced && !!src;

  useEffect(() => {
    // Guard: only call once
    if (readyCalledRef.current) return;

    if (!showVideo) {
      // No video (reduced-motion or no src): reveal poster immediately
      readyCalledRef.current = true;
      setReady(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Start video from the very beginning
    video.currentTime = 0;

    const reveal = () => {
      if (readyCalledRef.current) return;
      readyCalledRef.current = true;
      setReady(true);
    };

    video.addEventListener("canplay", reveal, { once: true });
    video.addEventListener("playing", reveal, { once: true });

    // Safety net: reveal after 2s max even if events never fire
    const fallback = setTimeout(reveal, 2000);

    video.play().catch(reveal);

    return () => {
      video.removeEventListener("canplay", reveal);
      video.removeEventListener("playing", reveal);
      clearTimeout(fallback);
    };
  }, [showVideo, src]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={`relative overflow-hidden bg-primary ${className}`}>
      {/* Background: only visible once video is ready — no photo flash */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {!showVideo && poster ? (
          /* Reduced-motion fallback: show poster image */
          <img
            src={poster}
            alt={alt}
            className="hero-kenburns absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* Video — the only thing that shows when motion is allowed */
          <video
            ref={videoRef}
            className="hero-kenburns absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {src && <source src={src} type="video/mp4" />}
          </video>
        )}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>

      {/* Content — reveals at the exact same time as the video */}
      <div
        className={`transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
