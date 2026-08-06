import { useEffect, useRef, useState } from "react";

/**
 * Cinematic backdrop for section heroes: starts invisible and fades in once
 * the video is ready to play (or immediately for poster fallback). This ensures
 * the video, background, and overlaid content all reveal simultaneously.
 * Skipped for reduced-motion users.
 *
 * Pass `onReady` to coordinate sibling content visibility with the video reveal.
 */
export function VideoBackdrop({
  poster,
  src,
  alt = "",
  onReady,
}: {
  poster: string;
  src?: string;
  alt?: string;
  onReady?: () => void;
}) {
  const [reduced, setReduced] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Keep onReady in a ref so it's always up-to-date without being a useEffect dependency.
  // This prevents the effect from re-running (and resetting video.currentTime = 0)
  // every time the parent re-renders and creates a new inline function reference.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);

  const showVideo = !reduced && !!src;

  useEffect(() => {
    if (!showVideo) {
      // Poster-only fallback: ready immediately
      onReadyRef.current?.();
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    // Reset and play from the beginning
    video.currentTime = 0;

    const reveal = () => onReadyRef.current?.();
    video.addEventListener("canplay", reveal, { once: true });
    video.addEventListener("playing", reveal, { once: true });

    // Safety net: trigger onReady after 1.5s even if events don't fire
    const fallback = setTimeout(() => onReadyRef.current?.(), 1500);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => onReadyRef.current?.());
    }

    return () => {
      video.removeEventListener("canplay", reveal);
      video.removeEventListener("playing", reveal);
      clearTimeout(fallback);
    };
  // Only re-run if video src or motion preference changes — NOT when onReady changes
  }, [showVideo, src]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0 -z-20 h-full w-full overflow-hidden bg-primary">
      {!showVideo && poster && (
        <img
          src={poster}
          alt={alt}
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
        />
      )}
      {showVideo && (
        <video
          ref={videoRef}
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
