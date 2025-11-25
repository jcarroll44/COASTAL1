// app/components/WeekTimeline.tsx
"use client";

type WeekTimelineProps = {
  startDate: string;
  endDate: string;
  chairSets: number;
  bonfireDate: string | null;
  bonfireTime: string | null;
  photoDate: string | null;
  photoTime: string | null;
};

type DayCell = {
  iso: string;
  labelWeekday: string;
  labelMonthDay: string;
  hasChairs: boolean;
  hasBonfire: boolean;
  hasPhoto: boolean;
  bonfireTimeLabel?: string;
  photoTimeLabel?: string;
};

function buildDays(
  startDate: string,
  endDate: string,
  chairSets: number,
  bonfireDate: string | null,
  bonfireTime: string | null,
  photoDate: string | null,
  photoTime: string | null
): DayCell[] {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate + "T12:00:00");
  const end = new Date(endDate + "T12:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return [];

  const days: DayCell[] = [];
  const maxSpan = 14; // guard rail so nobody breaks the UI

  let current = new Date(start);
  let steps = 0;

  while (current <= end && steps < maxSpan) {
    const iso = current.toISOString().slice(0, 10);
    const labelWeekday = current.toLocaleDateString(undefined, {
      weekday: "short",
    });
    const labelMonthDay = current.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    const hasChairs = chairSets > 0; // if they picked chairs, they apply to whole span

    const isBonfire = bonfireDate === iso;
    const isPhoto = photoDate === iso;

    const bonfireTimeLabel =
      isBonfire && bonfireTime
        ? new Date(`1970-01-01T${bonfireTime}`).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })
        : undefined;

    const photoTimeLabel =
      isPhoto && photoTime
        ? new Date(`1970-01-01T${photoTime}`).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })
        : undefined;

    days.push({
      iso,
      labelWeekday,
      labelMonthDay,
      hasChairs,
      hasBonfire: isBonfire,
      hasPhoto: isPhoto,
      bonfireTimeLabel,
      photoTimeLabel,
    });

    current.setDate(current.getDate() + 1);
    steps++;
  }

  return days;
}

export default function WeekTimeline(props: WeekTimelineProps) {
  const {
    startDate,
    endDate,
    chairSets,
    bonfireDate,
    bonfireTime,
    photoDate,
    photoTime,
  } = props;

  const days = buildDays(
    startDate,
    endDate,
    chairSets,
    bonfireDate,
    bonfireTime,
    photoDate,
    photoTime
  );

  if (!days.length) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-3 text-[11px] sm:text-xs text-sky-700">
        <div>
          <div className="font-semibold tracking-[0.16em] uppercase text-sky-600">
            Your week at a glance
          </div>
          <p className="mt-1">
            Choose your start and end dates to see each day of your trip mapped
            out.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-sky-500">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 font-semibold">
            C
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 font-semibold">
            B
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 font-semibold">
            P
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Day chips */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((day) => {
            const hasAny = day.hasChairs || day.hasBonfire || day.hasPhoto;

            const base =
              "flex-none w-[90px] sm:w-[96px] rounded-2xl border px-2.5 py-2.5 text-center shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)] transition-transform duration-150";
            const active =
              "border-sky-300 bg-gradient-to-b from-sky-50 to-sky-100/70";
            const inactive = "border-sky-100 bg-white/90";

            return (
              <div
                key={day.iso}
                className={`${base} ${
                  hasAny ? active : inactive
                } hover:-translate-y-[1px]`}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600">
                  {day.labelWeekday}
                </div>
                <div className="mt-0.5 text-[13px] font-semibold text-sky-950">
                  {day.labelMonthDay}
                </div>

                {/* Icons row */}
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <BadgeDot
                    label="C"
                    active={day.hasChairs}
                    ariaLabel="Chairs"
                  />
                  <BadgeDot
                    label="B"
                    active={day.hasBonfire}
                    ariaLabel="Bonfire"
                  />
                  <BadgeDot
                    label="P"
                    active={day.hasPhoto}
                    ariaLabel="Photography"
                  />
                </div>

                {/* Times / labels */}
                {(day.bonfireTimeLabel || day.photoTimeLabel) && (
                  <div className="mt-1.5 space-y-0.5 text-[10px] text-sky-700">
                    {day.bonfireTimeLabel && (
                      <div className="truncate">
                        Bonfire • {day.bonfireTimeLabel}
                      </div>
                    )}
                    {day.photoTimeLabel && (
                      <div className="truncate">
                        Photo • {day.photoTimeLabel}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-sky-600">
        <LegendItem label="Chairs" dotLabel="C" />
        <LegendItem label="Bonfire" dotLabel="B" />
        <LegendItem label="Family Photography" dotLabel="P" />
        <span className="hidden sm:inline text-sky-400">•</span>
        <span className="hidden sm:inline text-sky-500">
          Filled dots = scheduled, outline = available.
        </span>
      </div>
    </div>
  );
}

function BadgeDot({
  label,
  active,
  ariaLabel,
}: {
  label: string;
  active: boolean;
  ariaLabel: string;
}) {
  const base =
    "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold";
  const on =
    "border-sky-500 bg-sky-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.5)]";
  const off = "border-sky-200 bg-sky-50 text-sky-500";

  return (
    <span aria-label={ariaLabel} className={`${base} ${active ? on : off}`}>
      {label}
    </span>
  );
}

function LegendItem({ label, dotLabel }: { label: string; dotLabel: string }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-sky-300 bg-sky-50 text-[10px] font-semibold text-sky-600">
        {dotLabel}
      </span>
      <span>{label}</span>
    </div>
  );
}