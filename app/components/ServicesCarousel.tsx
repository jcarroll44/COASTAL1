"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Item = {
  title: string;
  blurb: string;
  image: string;
  href: string;
  badge?: string;
};

export default function ServicesCarousel({
  items,
  kicker = "Beach Essentials by Coastal",
  title = "Signature Services – All in One Place.",
}: {
  items: Item[];
  kicker?: string;
  title?: string;
}) {
  const count = items.length;

  // If we ever only have 1 item, just show a simple card.
  if (count <= 1) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/80 via-white to-sky-50/70 p-6 md:p-8 shadow-[0_18px_60px_-35px_rgba(2,132,199,0.35)]">
        <Header kicker={kicker} title={title} />
        <div className="mt-4">
          <Card item={items[0]} priority />
        </div>
      </div>
    );
  }

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [asGrid, setAsGrid] = useState(false);
  const [stepPx, setStepPx] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // 0..count-1

  // We render 3 copies so the user always lives in the middle block.
  const COPIES = 3;
  const extendedItems = Array.from({ length: COPIES }, () => items).flat();
  const baseOffset = count; // start-of-middle-block index (global index)

  // Measure card width (step) & center on middle copy on first load.
  useEffect(() => {
    if (count < 2) return;
    const scroller = scrollerRef.current;
    const firstMiddle = cardRefs.current[baseOffset];
    const secondMiddle = cardRefs.current[baseOffset + 1];
    if (!scroller || !firstMiddle || !secondMiddle) return;

    const step = secondMiddle.offsetLeft - firstMiddle.offsetLeft;
    if (step <= 0) return;

    setStepPx(step);
    // Center on the first card of the middle copy
    scroller.scrollLeft = baseOffset * step;
    setCurrentIndex(0);
  }, [count]);

  // Scroll helpers
  const scrollByStep = (dir: "next" | "prev") => {
    const scroller = scrollerRef.current;
    if (!scroller || stepPx === 0) return;
    scroller.scrollBy({
      left: dir === "next" ? stepPx : -stepPx,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    if (asGrid || count <= 1) return;
    scrollByStep("prev");
  };

  const handleNext = () => {
    if (asGrid || count <= 1) return;
    scrollByStep("next");
  };

  // Sync dots + handle infinite wrapping when the user scrolls (arrows or trackpad)
  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller || stepPx === 0 || count <= 1) return;

    const approxGlobalIndex = scroller.scrollLeft / stepPx;
    let globalIndex = Math.round(approxGlobalIndex);

    // Teleport if we drift too far left or right (into the outer copies)
    const minGlobal = baseOffset - count; // left threshold
    const maxGlobal = baseOffset + count; // right threshold

    if (globalIndex <= minGlobal) {
      // Moved too far left: jump one block to the right
      scroller.scrollLeft += count * stepPx;
      globalIndex += count;
    } else if (globalIndex >= maxGlobal) {
      // Moved too far right: jump one block to the left
      scroller.scrollLeft -= count * stepPx;
      globalIndex -= count;
    }

    // Map global index (in extended array) back to 0..count-1
    const relative = ((globalIndex - baseOffset) % count + count) % count;
    if (relative !== currentIndex) {
      setCurrentIndex(relative);
    }
  };

  // Jump to a specific *real* index from dots
  const goToRealIndex = (target: number) => {
    const scroller = scrollerRef.current;
    if (!scroller || stepPx === 0 || count <= 1) return;
    // Position in the middle copy
    const globalTarget = baseOffset + target;
    scroller.scrollTo({
      left: globalTarget * stepPx,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/80 via-white to-sky-50/70 p-6 md:p-8 shadow-[0_18px_60px_-35px_rgba(2,132,199,0.35)]">
      <Header
        kicker={kicker}
        title={title}
        asGrid={asGrid}
        onToggleGrid={() => setAsGrid((v) => !v)}
        onPrev={handlePrev}
        onNext={handleNext}
        showArrows={!asGrid && count > 1}
      />

      {/* GRID VIEW */}
      {asGrid ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <Card key={idx} item={item} priority={idx < 4} />
          ))}
        </div>
      ) : (
        <>
          {/* Edge fades for nicer scroll */}
          <div className="pointer-events-none absolute inset-y-[120px] left-0 w-14 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-[120px] right-0 w-14 bg-gradient-to-l from-white to-transparent" />

          {/* Infinite scroll row */}
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="services-scroll mt-4 flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            <style>{`
              .services-scroll::-webkit-scrollbar { display: none; }
            `}</style>

            {extendedItems.map((item, idx) => (
              <article
                key={`${item.title}-${idx}`}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[48%] lg:w-[24%]"
              >
                <Card item={item} priority={idx < 4} />
              </article>
            ))}

            {/* spacer so last visible card isn't slammed into edge */}
            <div className="shrink-0 w-[5%] sm:w-[8%] lg:w-[10%]" />
          </div>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToRealIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-sky-600" : "w-2 bg-sky-200"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Header + Controls ---------- */

function Header({
  kicker,
  title,
  asGrid,
  onToggleGrid,
  onPrev,
  onNext,
  showArrows,
}: {
  kicker: string;
  title: string;
  asGrid?: boolean;
  onToggleGrid?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  showArrows?: boolean;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3 md:mb-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
          {kicker}
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-sky-900 md:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Chairs, bonfires, boats and photos — the core services most guests
          build their beach week around.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {onToggleGrid && (
          <button
            type="button"
            onClick={onToggleGrid}
            className="hidden sm:inline-flex items-center rounded-full border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-medium text-sky-700 shadow-sm hover:bg-sky-50"
          >
            {asGrid ? "Carousel view" : "Grid view"}
          </button>
        )}

        {showArrows && onPrev && onNext && (
          <>
            <IconButton label="Previous" direction="prev" onClick={onPrev} />
            <IconButton label="Next" direction="next" onClick={onNext} />
          </>
        )}
      </div>
    </div>
  );
}

function IconButton({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50 transition"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d={
            direction === "prev"
              ? "M15 19l-7-7 7-7"
              : "M9 5l7 7-7 7"
          }
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ---------- Card ---------- */

function Card({ item, priority }: { item: Item; priority?: boolean }) {
  return (
    <Link
      href={item.href}
      className="group block h-full overflow-hidden rounded-2xl border border-sky-100 bg-white ring-1 ring-transparent shadow-[0_10px_30px_-20px_rgba(2,132,199,0.25)] transition hover:ring-sky-200"
    >
      <div className="relative h-40 w-full sm:h-44 md:h-44 lg:h-44">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>

      <div className="flex h-[170px] flex-col justify-between px-4 py-3">
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
            Service
          </div>
          <h3 className="line-clamp-1 text-base font-semibold text-sky-900">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-sky-700/90">
            {item.blurb}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-sky-700">
          <span>View details</span>
          <svg
            className="transition group-hover:translate-x-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
