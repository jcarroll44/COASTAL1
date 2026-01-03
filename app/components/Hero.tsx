"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BaseProps = {
  title?: string;
  children?: React.ReactNode;
};

type HeroImageOption = {
  /**
   * Optional explicit CSS object-position string (overrides offsetY)
   * Example: "50% 10%"
   */
  position?: string;

  /**
   * Pixel adjustment from the default 70% vertical position.
   * Positive offsetY shows MORE TOP (crops more bottom)
   * Negative offsetY shows MORE BOTTOM (crops more top)
   */
  offsetY?: number;
};

type CarouselProps = BaseProps & {
  images: string[];
  interval?: number;

  // per-image crop controls
  options?: HeroImageOption[];

  // allowed if you pass them (no visual change otherwise)
  fadeDuration?: number;
  scale?: number;

  poster?: never;
  videoSrc?: never;
};

type VideoProps = BaseProps & {
  poster: string;
  videoSrc?: string;
  images?: never;
  interval?: never;

  options?: never;
  fadeDuration?: never;
  scale?: never;
};

type HeroProps = CarouselProps | VideoProps;

export default function Hero(props: HeroProps) {
  const [allowMotion, setAllowMotion] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setAllowMotion(q.matches);
    const onChange = (e: MediaQueryListEvent) => setAllowMotion(e.matches);
    q.addEventListener?.("change", onChange);
    return () => q.removeEventListener?.("change", onChange);
  }, []);

  const isCarousel = "images" in props;

  // Slightly shorter hero so the section below peeks through
  const height = "h-[440px] md:h-[580px] lg:h-[660px]";

  const imgs = isCarousel ? props.images.filter(Boolean) : [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isCarousel || imgs.length <= 1) return;
    const ms = props.interval ?? 6000;
    const t = setInterval(() => setIdx((n) => (n + 1) % imgs.length), ms);
    return () => clearInterval(t);
  }, [isCarousel, imgs.length, props.interval]);

  const currentImage = useMemo(() => {
    if (!isCarousel) return null;
    if (!imgs.length) return null;
    return imgs[idx] || imgs[0] || null;
  }, [isCarousel, imgs, idx]);

  const currentObjectPosition = useMemo(() => {
    if (!isCarousel) return "center 70%";
    const opt = props.options?.[idx];

    if (opt?.position) return opt.position;

    const offsetY = opt?.offsetY ?? 0;
    return `center calc(70% - ${offsetY}px)`;
  }, [isCarousel, idx, props.options]);

  return (
    <section className="relative isolate px-2 md:px-3 bg-white">
      {/* square bottom (no rounding) */}
      <div className={`relative ${height} overflow-hidden`}>
        {/* Media */}
        {isCarousel ? (
          currentImage && (
            <Image
              key={`${idx}-${currentImage}`} // ✅ FIX: remount per slide to prevent 1-frame crop glitch
              src={currentImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: currentObjectPosition }}
            />
          )
        ) : (
          <>
            {props.poster && (
              <Image
                src={props.poster}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: "center 40%" }}
              />
            )}
            {props.videoSrc && allowMotion && (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "center 40%" }}
                autoPlay
                muted
                loop
                playsInline
                poster={props.poster || undefined}
              >
                <source src={props.videoSrc} type="video/mp4" />
              </video>
            )}
          </>
        )}

        {/* gradient for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/10" />
      </div>

      {/* Booking bar overlay */}
      <div className="pointer-events-none absolute inset-x-2 md:inset-x-3 bottom-8 md:bottom-10 z-10 flex w-auto justify-center">
        <div className="pointer-events-auto w-full max-w-7xl">
          {props.children}
        </div>
      </div>
    </section>
  );
}
