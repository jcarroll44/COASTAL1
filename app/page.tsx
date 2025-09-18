import Hero from "@/components/Hero";
import MarketLanding from "@/components/MarketLanding";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Header comes from layout.tsx, so we just start with the hero */}
      <Hero image="/hero.jpg" />

      <MarketLanding />

      {/* Bottom “Already booked?” rail — restored */}
      <section className="mt-10 mb-14">
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
              <select className="h-10 rounded-xl border border-sky-200 bg-white px-2 text-[14px]">
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

      {/* Footer stays pinned to the bottom */}
      <footer className="mt-10 border-t border-sky-100 py-10">
        <div className="coastal-container text-[12px] text-sky-700/80">
          © {new Date().getFullYear()} Coastal Beach Company · Public Beaches
          (30A) · PCB · Destin
        </div>
      </footer>
    </>
  );
}
