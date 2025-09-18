export default function PlanBar() {
  return (
    <section className="mx-auto my-8 max-w-6xl px-4">
      <div className="rounded-2xl bg-sky-900/90 p-4 text-white shadow">
        <div className="mb-2 text-sm font-semibold opacity-90">
          Already booked a home?
        </div>
        <div className="flex gap-2">
          <input
            className="h-10 flex-1 rounded-xl border border-sky-200/30 bg-white/95 px-3 text-[14px] text-sky-900 outline-none"
            placeholder="Enter your rental address"
          />
          <select className="h-10 rounded-xl border border-sky-200/30 bg-white/95 px-3 text-[14px] text-sky-900">
            <option value="pcb">PCB</option>
            <option value="30a">30A</option>
          </select>
          <a
            href="/suite"
            className="grid h-10 place-items-center rounded-xl bg-white/95 px-4 text-sm font-semibold text-sky-900 hover:bg-white"
          >
            Open Suite
          </a>
        </div>
      </div>
    </section>
  );
}
