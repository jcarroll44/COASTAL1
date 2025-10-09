"use client";

import { useEffect, useState } from "react";

type HeroProps = {
  // pass either a single image OR an array
  image?: string;
  images?: string[];
  interval?: number; // ms
  heightClamp?: string; // CSS clamp string, e.g. "clamp(480px, 68vh, 860px)"
  objectPosition?: string; // crop focus
};

export default function Hero({
  image,
  images,
  interval = 6000,
  heightClamp = "clamp(600px, 90vh, 1200px)",
  objectPosition = "center 50%",
}: HeroProps) {
  // normalize slides safely
  const slides = images?.length ? images : image ? [image] : ["/hero.jpg"];
  const [idx, setIdx] = useState(0);

  // auto-advance only if more than 1 slide
  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [slides.length, interval]);

  return (
    <section className="relative w-full">
      {/* full-bleed, tall, no max-width */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: heightClamp }}
      >
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-800 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            style={{ objectPosition }}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}

        {/* white dots (only when rotating) */}
        {slides.length > 1 && (
          <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === idx ? "bg-white" : "bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
