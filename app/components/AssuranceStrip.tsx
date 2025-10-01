// app/components/AssuranceStrip.tsx
export default function AssuranceStrip() {
    const Item = ({
      icon,
      title,
      text,
    }: {
      icon: React.ReactNode;
      title: string;
      text: string;
    }) => (
      <div className="flex items-start gap-3">
        <div className="mt-[2px] grid h-8 w-8 place-items-center rounded-full bg-sky-50 text-sky-900 ring-1 ring-sky-100">
          {icon}
        </div>
        <div>
          <div className="text-[14px] font-semibold text-slate-900">{title}</div>
          <div className="text-[13px] text-slate-600">{text}</div>
        </div>
      </div>
    );
  
    return (
      <section className="px-6 py-10">
        <div className="coastal-container grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl bg-white ring-1 ring-slate-200/70 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
          <Item
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l4 4 10-10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Local crew, every day"
            text="Reliable setup & takedown—same faces, same standard."
          />
          <Item
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Transparent pricing"
            text="No surprises. Your quote is your total."
          />
          <Item
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 16l4-2 4 2 4-2 4 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 10l4-2 4 2 4-2 4 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Weather-smart plans"
            text="Flexibility for wind & surf so your day stays easy."
          />
        </div>
      </section>
    );
  }
  