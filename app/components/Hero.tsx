// components/Hero.tsx
import Image from "next/image";

export default function Hero({ image }: { image: string }) {
  return (
    <section className="relative coastal-container mt-6">
      {/* Hero Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={image}
          alt="Coastal hero"
          width={1600}
          height={900}
          priority
          className="w-full object-cover h-[420px] sm:h-[560px] md:h-[640px]"
        />

        {/* Selection Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%]">
          <div className="flex gap-2 items-center rounded-full bg-white/95 backdrop-blur-md border border-sky-200 shadow-lg px-4 py-2">
            <input
              type="text"
              placeholder="Enter your rental address or home name"
              className="flex-1 h-11 rounded-full border border-sky-200 px-4 text-[14px] outline-none focus:ring-2 focus:ring-sky-300 bg-white"
            />
            <select className="h-11 rounded-full border border-sky-200 px-3 text-[14px] bg-white">
              <option value="pcb">PCB</option>
              <option value="30a">30A</option>
            </select>
            <button className="h-11 px-6 rounded-full bg-sky-900 text-white font-semibold hover:bg-sky-950 transition">
              Open
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
