// app/30a/page.tsx
import Hero from "@/components/Hero";
import OffersCarousel from "@/components/OffersCarousel";
import ThirtyAHomeMap from "@/components/ThirtyAHomeMap";
import Link from "next/link";

export default function Page30A() {
  return (
    <>
      {/* Hero — use your 30A hero image */}
      <Hero image="/hero-30a.jpg" />

      {/* 30A offerings carousel */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-14">
        <OffersCarousel location="30a" />
      </section>

      {/* Closest Beach Access Map (driving distance + satellite toggle) */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-8 md:pt-10">
        <ThirtyAHomeMap
          mapStyle="mapbox://styles/jcarroll44/cmg9m3ee8005n01qwa6im9637"
          satelliteStyle="mapbox://styles/mapbox/satellite-v9"
          preferDrivingDistance
          initialViewState={{ longitude: -86.1, latitude: 30.32, zoom: 10.8 }}
          height={520}
        />
      </section>

      {/* Already booked rail */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 mt-12 md:mt-14 mb-16">
        <div className="rounded-2xl border border-sky-100 bg-white/70 p-3 backdrop-blur shadow-sm">
          <div className="mb-2 text-[13px] font-medium text-sky-900">
            Already booked a home?
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Enter your rental address"
              className="h-10 w-full rounded-xl border border-sky-200 bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
            />
            <select
              className="h-10 rounded-xl border border-sky-200 bg-white px-2 text-[14px]"
              defaultValue="30a"
            >
              <option value="pcb">PCB</option>
              <option value="30a">30A</option>
            </select>
            <Link
              href="/suite"
              className="grid h-10 place-items-center rounded-xl bg-sky-900 px-4 text-sm font-semibold text-white hover:bg-sky-950"
            >
              Open Suite
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-sky-100 py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 text-[12px] text-sky-700/80">
          © {new Date().getFullYear()} Coastal Beach Company · Public Beaches
          (30A) · PCB · Destin
        </div>
      </footer>
    </>
  );
}
