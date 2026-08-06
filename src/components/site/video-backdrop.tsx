import { useEffect, useState } from "react";

/**
 * Cinematic backdrop for section heroes: the poster image always renders (SSR,
 * mobile, reduced-motion, and as the <video> poster), with a muted looping clip
 * layered over it only on desktop when motion is allowed. If the clip ever fails
 * to load, the poster underneath keeps the hero intact.
 */
export function VideoBackdrop({
  poster,
  src,
  alt = "",
}: {
  poster: string;
  src?: string;
  alt?: string;
}) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  const showVideo = !reduced && !!src;

  return (
    <>
      <img
        src={poster}
        alt={alt}
        className="hero-kenburns absolute inset-0 h-full w-full object-cover"
      />
      {showVideo && (
        <video
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </>
  );
}
