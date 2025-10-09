"use client";

import { useState, useEffect } from "react";

const images = ["/hero3.jpg", "/hero.jpg", "/hero1.jpg"];

export default function HeroRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // rotate every 5s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full">
      {/* Image container */}
      <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <img
          key={index}
          src={images[index]}
          alt="Coastal beach hero"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
