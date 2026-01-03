// components/Hero.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type BaseProps = {
  title?: string;
  children?: React.ReactNode;
};

type HeroImageOption = {
  position?: string; // e.g. "50% 10%"
  offsetY?: number; // px adjustment from default 70%
};

type HeroTab = {
  label: string;
};

type HeroProps =
  | (BaseProps & {
      images: string[];
      interval?: number;
      options?: HeroImageOption[];
      tabs?: HeroTab[];
      fadeDuration?: number; // used as slide animation duration for vertical push
      scale?: number;
      poster?: never;
      videoSrc?: never;
    })
  | (BaseProps & {
      poster: string;
      videoSrc?: string;
      images?: never;
      interval?: never;
      options?: never;
      tabs?: never;
      fadeDuration?: never;
      scale?: never;
    });

function labelStyle(label: string) {
  // Auto-fit long strings so they never clip
  const len = label.length;
  if (len >= 18) {
    return {
      className:
        "text-[11px] md:text-[12px] tracking-[0.10em] font-semibold uppercase",
    };
  }
  if (len >= 14) {
    return {
      className:
        "text-[11.5px] md:text-[12.5px] tracking-[0.11em] font-semibold uppercase",
    };
  }
  return {
    className:
      "text-[12px] md:text-[13px] tracking-[0.12em] font-semibold uppercase",
  };
}

export default function Hero(props: HeroProps) {
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setAllowMotion(q.matches);
    const onChange = (e: any) => setAllowMotion(!!e?.matches);
    q.addEventListener?.("change", onChange);
    return () => q.removeEventListener?.("change", onChange);
  }, []);

  const isCarousel = "images" in props;

  // Slightly shorter hero so the section below peeks through
  const height = "h-[440px] md:h-[580px] lg:h-[660px]";

  const imgs = isCarousel ? (props.images || []).filter(Boolean) : [];
  const [idx, setIdx] = useState(0);

  // track outgoing slide index for the push animation
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [anim, setAnim] = useState(false);

  const intervalMs = isCarousel ? props.interval ?? 6000 : 0;
  const slideMs = isCarousel ? props.fadeDuration ?? 800 : 0;
  const scale = isCarousel ? props.scale ?? 1.02 : 1;

  // pause on hover
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!isCarousel || imgs.length <= 1) return;
    if (paused) return;
    const t = setInterval(
      () => setIdx((n) => (n + 1) % imgs.length),
      intervalMs
    );
    return () => clearInterval(t);
  }, [isCarousel, imgs.length, intervalMs, paused]);

  // reliable previous index
  const lastIdxRef = useRef(0);
  useEffect(() => {
    if (!isCarousel) return;

    if (!allowMotion) {
      lastIdxRef.current = idx;
      setPrevIdx(null);
      setAnim(false);
      return;
    }

    const from = lastIdxRef.current;
    const to = idx;
    if (from === to) return;

    setPrevIdx(from);
    setAnim(true);

    const t = setTimeout(() => {
      setAnim(false);
      setPrevIdx(null);
      lastIdxRef.current = to;
    }, slideMs);

    return () => clearTimeout(t);
  }, [idx, allowMotion, isCarousel, slideMs]);

  const currentSrc = useMemo(() => {
    if (!isCarousel) return null;
    return imgs[idx] || imgs[0] || null;
  }, [isCarousel, imgs, idx]);

  const outgoingSrc = useMemo(() => {
    if (!isCarousel) return null;
    if (prevIdx === null) return null;
    return imgs[prevIdx] || null;
  }, [isCarousel, imgs, prevIdx]);

  const getObjectPosition = (i: number) => {
    if (!isCarousel) return "center 40%";
    const opt = props.options?.[i];
    if (opt?.position) return opt.position;
    const offsetY = opt?.offsetY ?? 0;
    return `center calc(70% - ${offsetY}px)`;
  };

  const tabs = isCarousel ? props.tabs : undefined;
  const showTabs = !!tabs && tabs.length > 0;

  const goTo = (i: number) => {
    if (!isCarousel) return;
    if (i < 0 || i >= imgs.length) return;
    setIdx(i);
  };

  return (
    <section className="relative isolate px-0 bg-white">
      <div
        className={`relative ${height} overflow-hidden`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Media */}
        {isCarousel ? (
          <div className="absolute inset-0">
            {/* OUTGOING (pushes down) */}
            {outgoingSrc && allowMotion && anim && (
              <div
                className="absolute inset-0"
                style={{
                  transform: "translate3d(0, 0, 0)",
                  animation: `heroPushOut ${slideMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
                  willChange: "transform",
                }}
              >
                <Image
                  src={outgoingSrc}
                  alt=""
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                  style={{
                    objectPosition: getObjectPosition(prevIdx ?? 0),
                    transform: `scale(${scale})`,
                  }}
                />
              </div>
            )}

            {/* INCOMING (starts above and pushes in) */}
            {currentSrc && (
              <div
                className="absolute inset-0"
                style={{
                  transform:
                    allowMotion && anim
                      ? "translate3d(0, -100%, 0)"
                      : "translate3d(0, 0, 0)",
                  animation:
                    allowMotion && anim
                      ? `heroPushIn ${slideMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`
                      : undefined,
                  willChange: allowMotion ? "transform" : undefined,
                }}
              >
                <Image
                  src={currentSrc}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={prevIdx === null}
                  className="object-cover"
                  style={{
                    objectPosition: getObjectPosition(idx),
                    transform: `scale(${scale})`,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {"poster" in props && props.poster && (
              <Image
                src={props.poster}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_40%]"
              />
            )}
            {"videoSrc" in props && props.videoSrc && allowMotion && (
              <video
                className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
                autoPlay
                muted
                loop
                playsInline
                poster={("poster" in props && props.poster) || undefined}
              >
                <source src={props.videoSrc} type="video/mp4" />
              </video>
            )}
          </>
        )}

        {/* gradient for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

        {/* RIGHT DOCKED SERVICE RAIL */}
        {showTabs && isCarousel && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* tuck slightly offscreen then slide in on hover */}
            <div className="group translate-x-[10px] hover:translate-x-0 transition-transform duration-300">
              <div className="relative bg-white/70 backdrop-blur-md ring-1 ring-black/5 shadow-[0_18px_60px_-45px_rgba(0,0,0,0.45)]">
                {/* inside edge line */}
                <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-sky-900/10" />

                {/* tabs */}
                <div className="flex flex-col">
                  {tabs!.map((t, i) => {
                    const active = i === idx;
                    const fit = labelStyle(t.label);

                    return (
                      <button
                        key={`${t.label}-${i}`}
                        type="button"
                        onClick={() => goTo(i)}
                        className={[
                          "relative block w-[46px] md:w-[52px]",
                          active ? "py-4 md:py-5" : "py-2.5 md:py-3",
                          "px-1.5 md:px-2",
                          "transition-all duration-200 ease-out",

                          // 👇 inactive = slightly more transparent / receded
                          active
                            ? "bg-white/90 shadow-[0_12px_28px_-18px_rgba(0,93,156,0.45)] translate-x-[-9px]"
                            : "bg-white/45 hover:bg-white/60 opacity-80",

                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
                        ].join(" ")}
                        aria-current={active ? "true" : "false"}
                        aria-label={t.label}
                      >
                        {/* active indicator */}
                        <span
                          className={[
                            "absolute right-0 top-0 h-full",
                            active
                              ? "w-[3px] bg-sky-700"
                              : "w-[2px] bg-transparent",
                          ].join(" ")}
                        />

                        {/* label */}
                        <span
                          className={[
                            "block mx-auto leading-none",
                            fit.className,
                            active
                              ? "text-sky-800"
                              : "text-sky-900/45 hover:text-sky-900/70",
                          ].join(" ")}
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {t.label}
                        </span>

                        {/* subtle “active lift” so it feels like it pops out */}
                        {active && (
                          <span className="pointer-events-none absolute inset-x-1 bottom-2 h-px bg-sky-900/10" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* round only the INSIDE edge (visual softness without creating a right-side gap) */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-4">
                <div className="h-full w-full rounded-l-2xl bg-transparent" />
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes heroPushOut {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(0, 100%, 0);
            }
          }
          @keyframes heroPushIn {
            from {
              transform: translate3d(0, -100%, 0);
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }
        `}</style>
      </div>

      {/* Booking bar overlay */}
      <div className="pointer-events-none absolute inset-x-2 md:inset-x-3 bottom-8 md:bottom-10 z-20 flex w-auto justify-center">
        <div className="pointer-events-auto w-full max-w-7xl">
          {props.children}
        </div>
      </div>
    </section>
  );
}
