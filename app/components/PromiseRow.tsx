function Item({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white p-3 md:p-4 shadow-sm">
      <div className="mt-0.5 h-8 w-8 grid place-items-center rounded-full bg-sky-50 text-sky-900 ring-1 ring-sky-100">
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-slate-900">{title}</div>
        <div className="text-[12.5px] text-slate-600">{copy}</div>
      </div>
    </li>
  );
}

export default function PromiseRow() {
  return (
    <section className="py-8">
      <div className="coastal-container">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Item
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M4 7h16M7 12h10M9 17h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            }
            title="Local crew, every day"
            copy="Reliable daily setup & takedown—same faces, same standard."
          />
          <Item
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M3 12h18M12 3v18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            }
            title="Transparent pricing"
            copy="No surprises. Your quote is your total."
          />
          <Item
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M4 12a8 8 0 1016 0 8 8 0 00-16 0Zm4-1l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            }
            title="Weather-smart plans"
            copy="Flexible for wind & surf so your day stays easy."
          />
        </ul>
      </div>
    </section>
  );
}
