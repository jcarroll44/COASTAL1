// app/pcb/page.tsx
import Hero from "@/components/Hero";
import OffersCarousel from "@/components/OffersCarousel";
import HomeLegacyHero from "@/components/HomeLegacyHero";
import Link from "next/link";

export default function PagePCB() {
  return (
    <>
      {/* PCB hero (use /hero-pcb.jpg if available) */}
      <Hero image="/hero-pcb.jpg" />

      {/* Location-scoped offerings */}
      <OffersCarousel location="pcb" />

      {/* Legacy hospitality story */}
      <HomeLegacyHero />

      {/* Already booked rail */}
      <section className="mt-14 mb-16">
        <div className="coastal-container max-w-[1120px]">
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
                defaultValue="pcb"
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
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-sky-100 py-10">
        <div className="coastal-container text-[12px] text-sky-700/80">
          © {new Date().getFullYear()} Coastal Beach Company · Public Beaches
          (30A) · PCB · Destin
        </div>
      </footer>
    </>
  );
}
