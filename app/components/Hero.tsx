// app/components/Hero.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type BaseProps = {
  children?: React.ReactNode;
  childrenPosition?: "bottom" | "overlay";
};

type HeroImageOption = {
  position?: string;
  offsetY?: number;
};

type CarouselProps = {
  images: string[];
  interval?: number;
  fadeDuration?: number; // used as slide transition duration
  options?: HeroImageOption[];
  fit?: "cover" | "contain";
};

type PosterProps = {
  poster: string;
  posterPosition?: string;
  fit?: "cover" | "contain";
};

type HeroProps = BaseProps & (CarouselProps | PosterProps);

export default function Hero(props: HeroProps) {
  const childrenPosition = props.childrenPosition ?? "bottom";
  const isCarousel = "images" in props && Array.isArray(props.images);

  const imgs = isCarousel ? props.images : [];
  const interval = isCarousel ? props.interval ?? 6500 : 0;
  const slideMs = isCarousel ? props.fadeDuration ?? 650 : 650;

  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  const targetFit = (("fit" in props && props.fit) ? props.fit : "cover") as
    | "cover"
    | "contain";

  const currentPoster = useMemo(() => {
    if (isCarousel) return null;
    return (props as PosterProps).poster;
  }, [isCarousel, props]);

  const getObjectPosition = (i: number) => {
    if (!isCarousel) return (props as PosterProps).posterPosition ?? "center";
    const opt = (props as CarouselProps).options?.[i];
    if (opt?.position) return opt.position;
    const offsetY = opt?.offsetY ?? 0;
    return `center calc(55% - ${offsetY}px)`;
  };

  const goTo = (next: number) => {
    if (!isCarousel || !imgs.length) return;
    setIdx(((next % imgs.length) + imgs.length) % imgs.length);
  };

  const next = () => goTo(idx + 1);
  const prev = () => goTo(idx - 1);

  const clearTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = () => {
    clearTimer();
    if (!isCarousel || !imgs.length) return;
    timerRef.current = window.setInterval(() => {
      setIdx((p) => (p + 1) % imgs.length);
    }, interval) as unknown as number;
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCarousel, imgs.length, interval]);

  const heroHeight =
    childrenPosition === "overlay"
      ? "h-[520px] md:h-[620px]"
      : "h-[560px] md:h-[660px]";

  return (
    <section className={`relative w-full ${heroHeight} overflow-hidden`}>
      {/* SLIDER / IMAGE */}
      <div className="absolute inset-0">
        {isCarousel && imgs.length > 0 && (
          <>
            <div
              className="absolute inset-0 flex will-change-transform"
              style={{
                transform: `translate3d(-${idx * 100}%,0,0)`,
                transition: `transform ${slideMs}ms ease-in-out`,
              }}
            >
              {imgs.map((src, i) => (
                <div key={src + i} className="relative h-full w-full flex-none">
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={i === 0}
                    className="object-cover"
                    style={{
                      objectFit: targetFit,
                      objectPosition: getObjectPosition(i),
                    }}
                  />
                </div>
              ))}
            </div>

            {/* overlay */}
            <div className="absolute inset-0 bg-black/10" />

            {/* ✅ Subtle arrows (no circle) */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-4 md:px-6">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => {
                  prev();
                  startTimer();
                }}
                className="
                  pointer-events-auto select-none
                  text-white/45 hover:text-white/70
                  transition
                  text-[30px] md:text-[36px]
                  font-semibold leading-none
                  drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]
                "
              >
                ‹
              </button>

              <button
                type="button"
                aria-label="Next image"
                onClick={() => {
                  next();
                  startTimer();
                }}
                className="
                  pointer-events-auto select-none
                  text-white/45 hover:text-white/70
                  transition
                  text-[30px] md:text-[36px]
                  font-semibold leading-none
                  drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]
                "
              >
                ›
              </button>
            </div>

            {/* Dots (simple, no pill) */}
            <div className="pointer-events-none absolute bottom-28 left-0 right-0 z-20 flex justify-center">
              <div className="pointer-events-auto flex items-center gap-2">
                {imgs.map((_, i) => {
                  const active = i === idx;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => {
                        goTo(i);
                        startTimer();
                      }}
                      className={[
                        "h-3 w-3 rounded-full transition",
                        "border border-white/70 hover:border-white",
                        active ? "bg-white" : "bg-transparent hover:bg-white/15",
                        "drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]",
                      ].join(" ")}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!isCarousel && currentPoster && (
          <>
            <Image
              src={currentPoster}
              alt=""
              fill
              priority
              className="object-cover"
              style={{
                objectFit: targetFit,
                objectPosition: getObjectPosition(0),
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
          </>
        )}

        {/* Overlay children mode */}
        {childrenPosition === "overlay" && props.children}
      </div>

      {/* ✅ BOOKING BAR — original (non-overlap) position + slightly condensed width */}
      {childrenPosition !== "overlay" && (
        <div className="pointer-events-none absolute inset-x-6 md:inset-x-10 bottom-10 z-30 flex justify-center">
          {/* was max-w-7xl earlier; this subtly tightens */}
          <div className="pointer-events-auto w-full max-w-6xl">
            {props.children}
          </div>
        </div>
      )}
    </section>
  );
}
