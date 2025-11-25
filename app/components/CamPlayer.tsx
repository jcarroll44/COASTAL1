"use client";

import { useEffect, useRef } from "react";
import type { CamConfig } from "@/app/beach-cams/cams";

declare global {
  interface Window {
    Hls?: any;
  }
}

export default function CamPlayer({ cam }: { cam: CamConfig }) {
  // External (SoWal, EarthCam, vendor pages) — show poster + “Watch Live” button
  if (cam.provider === "external") {
    const href = cam.externalHref || "#";
    return (
      <div className="relative h-full w-full">
        <img
          src={cam.poster || "/coastal-logo.png"}
          alt={cam.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35">
          <div className="rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-slate-900 shadow">
            Live on Source
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 rounded-full bg-[#0170BF] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Watch Live
          </a>
        </div>
      </div>
    );
  }

  // YouTube
  if (cam.provider === "youtube" && cam.videoId) {
    const src = `https://www.youtube.com/embed/${cam.videoId}?autoplay=1&mute=1&rel=0&playsinline=1&modestbranding=1`;
    return (
      <iframe
        src={src}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="origin-when-cross-origin"
        title={cam.title}
      />
    );
  }

  // HLS (.m3u8)
  if (cam.provider === "hls" && cam.hlsUrl) {
    return <HlsVideo src={cam.hlsUrl} poster={cam.poster} title={cam.title} />;
  }

  // Embeddable vendor iframe (that explicitly allows it)
  if (cam.provider === "iframe" && cam.iframeSrc) {
    return (
      <iframe
        src={cam.iframeSrc}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={cam.title}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-200">
      Cam source unavailable.
    </div>
  );
}

function HlsVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let hlsInstance: any | null = null;

    async function run() {
      const el = ref.current;
      if (!el) return;

      // Native HLS (Safari, some iOS contexts)
      if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = src;
        el.play().catch(() => {});
        return;
      }

      // hls.js for other browsers
      if (!window.Hls) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("failed to load hls.js"));
          document.head.appendChild(s);
        });
      }
      if (cancelled) return;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(el);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
          el.play().catch(() => {});
        });
      } else {
        // Fallback: direct play attempt
        el.src = src;
        el.play().catch(() => {});
      }
    }

    run();
    return () => {
      cancelled = true;
      if (hlsInstance) {
        try {
          hlsInstance.destroy();
        } catch {}
      }
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster || "/coastal-logo.png"}
      className="h-full w-full object-cover"
      controls
      playsInline
      muted
      autoPlay
      title={title}
    />
  );
}