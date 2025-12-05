// app/suite/pcb/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import condos from "../../data/condos.json";
import AmenityPackages from "@/components/AmenityPackages";
import SuiteContextSync from "../../components/SuiteContextSync";

/* ======================= Types ======================= */
type Condo = {
  name: string;
  address: string;
  slug: string;
  logo?: string;
  market?: "pcb" | "30a";
};

type AmenityKind =
  | "banana_boat"
  | "bonfire"
  | "parasail"
  | "paddleboard"
  | "jetski"
  | "photography";

type AmenityConfig = {
  id: AmenityKind;
  name: string;
  priceHint?: string;
};

type AddedItem = {
  amenity: AmenityKind;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  partySize: number;
  condo: string;
  notes?: string;
  seatingTier?: "up_to_8" | "up_to_12" | "up_to_20"; // bonfire
  addons?: { smores: boolean; extraHour: boolean; bluetoothSpeaker: boolean }; // bonfire
};

/* ======================= PRICING / Utils ======================= */
const PRICES = { chairsDay: 55, chairsWeekCap: 300, bonfire: 500, photo: 300 };

function toISODate(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
function diffDaysInclusive(start: string, end: string) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  s.setHours(12, 0, 0, 0);
  e.setHours(12, 0, 0, 0);
  const ms = e.getTime() - s.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 86400000) + 1;
}
function chairsPricePerSet(days: number) {
  if (days <= 0) return 0;
  return Math.min(days * PRICES.chairsDay, PRICES.chairsWeekCap);
}
function weekdayLabel(isoDate: string) {
  try {
    const d = new Date(isoDate + "T12:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short" });
  } catch {
    return null;
  }
}

/* ======================= STORAGE ======================= */
const STORAGE_KEY = "coastal.selectedCondo";

function persistCondo(c: any | null) {
  try {
    if (c) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

function readPersistedCondo(): any | null {
  try {
    const ls = localStorage.getItem(STORAGE_KEY);
    if (ls) return JSON.parse(ls);
  } catch {}
  try {
    const ss = sessionStorage.getItem(STORAGE_KEY);
    if (ss) return JSON.parse(ss);
  } catch {}
  return null;
}

/* ======================= CSV LOADER ======================= */
async function fetchCondosCSV(path = "/condos_pcb.csv"): Promise<string[]> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load condos CSV");
  const text = await res.text();
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",")[0]?.trim())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
}

/* ======================= Amenity Modal ======================= */
function AmenityModal({
  open,
  amenity,
  onClose,
  onSubmit,
  condosCSV = "/condos_pcb.csv",
}: {
  open: boolean;
  amenity: AmenityConfig | null;
  onClose: () => void;
  onSubmit: (payload: AddedItem) => void;
  condosCSV?: string;
}) {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [condoQuery, setCondoQuery] = useState("");
  const [condo, setCondo] = useState("");
  const [notes, setNotes] = useState("");

  const [seatingTier, setSeatingTier] =
    useState<AddedItem["seatingTier"]>("up_to_8");
  const [addons, setAddons] = useState<NonNullable<AddedItem["addons"]>>({
    smores: false,
    extraHour: false,
    bluetoothSpeaker: false,
  });

  const [allCondos, setAllCondos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchCondosCSV(condosCSV);
        if (!alive) return;
        setAllCondos(list);
        setErr(null);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load condos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, condosCSV]);

  useEffect(() => {
    if (open) {
      setPartySize(2);
      setDate("");
      setTime("");
      setCondo("");
      setCondoQuery("");
      setNotes("");
      setSeatingTier("up_to_8");
      setAddons({ smores: false, extraHour: false, bluetoothSpeaker: false });
    }
  }, [open, amenity?.id]);

  const filtered = useMemo(() => {
    const q = condoQuery.trim().toLowerCase();
    if (!q) return allCondos;
    return allCondos.filter((n) => n.toLowerCase().includes(q));
  }, [allCondos, condoQuery]);

  const canSubmit = Boolean(date && time && condo && amenity);
  if (!open || !amenity) return null;

  function submit() {
    const base = { date, time, partySize, condo, notes };
    const payload: AddedItem =
      amenity.id === "bonfire"
        ? { amenity: amenity.id, ...base, seatingTier, addons }
        : { amenity: amenity.id, ...base };
    onSubmit(payload);
    onClose();
  }

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 mx-3 sm:mx-0 animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-bottom-0">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">
                {amenity.name}
              </h3>
              {amenity.priceHint ? (
                <p className="text-slate-600 mt-1 text-sm">
                  {amenity.priceHint}
                </p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 hover:bg-slate-100"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-80"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0170BF]/25"
                />
              </label>
              <label className="block text-sm font-medium">
                Time
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0170BF]/25"
                />
              </label>
              <label className="block text-sm font-medium">
                Party size
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={partySize}
                  onChange={(e) =>
                    setPartySize(parseInt(e.target.value || "1"))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Your condo / property
                <input
                  type="text"
                  placeholder="Search condos…"
                  value={condoQuery}
                  onChange={(e) => setCondoQuery(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="h-[170px] overflow-auto rounded-xl border border-slate-200 bg-white">
                {loading ? (
                  <div className="p-3 text-sm text-slate-500">Loading…</div>
                ) : err ? (
                  <div className="p-3 text-sm text-rose-600">{err}</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {filtered.map((name) => {
                      const active = condo === name;
                      return (
                        <li
                          key={name}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 ${
                            active ? "bg-[#E9F4FA]" : ""
                          }`}
                          onClick={() => setCondo(name)}
                        >
                          {name}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {condo ? (
                <p className="text-xs text-slate-500">
                  Selected: <span className="font-medium">{condo}</span>
                </p>
              ) : null}
            </div>
          </div>

          {/* Bonfire options */}
          {amenity.id === "bonfire" && (
            <div className="mt-6 border-t pt-6">
              <h4 className="text-sm font-semibold mb-3">Bonfire options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium">
                  Seating tier
                  <select
                    value={seatingTier}
                    onChange={(e) =>
                      setSeatingTier(e.target.value as AddedItem["seatingTier"])
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="up_to_8">Up to 8 (base)</option>
                    <option value="up_to_12">Up to 12</option>
                    <option value="up_to_20">Up to 20</option>
                  </select>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={addons.smores}
                      onChange={(e) =>
                        setAddons((a) => ({ ...a, smores: e.target.checked }))
                      }
                    />
                    S’mores kit
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={addons.extraHour}
                      onChange={(e) =>
                        setAddons((a) => ({
                          ...a,
                          extraHour: e.target.checked,
                        }))
                      }
                    />
                    Extra hour
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={addons.bluetoothSpeaker}
                      onChange={(e) =>
                        setAddons((a) => ({
                          ...a,
                          bluetoothSpeaker: e.target.checked,
                        }))
                      }
                    />
                    Bluetooth speaker
                  </label>
                </div>
              </div>
            </div>
          )}

          <label className="block text-sm font-medium mt-6">
            Notes (optional)
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Any special requests or details we should know?"
            />
          </label>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={!canSubmit}
              onClick={submit}
              className={`px-5 py-2 rounded-lg text-white ${
                canSubmit
                  ? "bg-[#0170BF] hover:opacity-90"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
              Add to itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================= Page ======================= */
export default function PCBAmenitySuitePage() {
  const searchParams = useSearchParams();
  const condoSlugParam = (searchParams.get("condo") || "").toLowerCase();

  const PCB_CONDOS = useMemo(
    () =>
      (condos as Condo[])
        .filter((c) => (c.market ?? "pcb") === "pcb")
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  /* Condo selection */
  const [query, setQuery] = useState("");
  const [selectedCondo, setSelectedCondo] = useState<Condo | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // 1) URL ?condo=
    if (condoSlugParam) {
      const m =
        PCB_CONDOS.find((c) => c.slug.toLowerCase() === condoSlugParam) ||
        PCB_CONDOS.find((c) => c.name.toLowerCase() === condoSlugParam);
      if (m) {
        setSelectedCondo(m);
        setQuery(m.name);
        persistCondo(m);
        return;
      }
    }

    // 2) Persisted
    const persisted = readPersistedCondo();
    if (persisted?.slug) {
      const m = PCB_CONDOS.find((c) => c.slug === persisted.slug);
      if (m) {
        setSelectedCondo(m);
        setQuery(m.name);
      }
    }
  }, [condoSlugParam, PCB_CONDOS]);

  // Keep other tabs/windows in sync
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      const next = readPersistedCondo();
      if (next?.slug) {
        const m = PCB_CONDOS.find((c) => c.slug === next.slug);
        if (m) {
          setSelectedCondo(m);
          setQuery(m.name);
        }
      } else {
        setSelectedCondo(null);
        setQuery("");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [PCB_CONDOS]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PCB_CONDOS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, PCB_CONDOS]);

  function handleSelectCondo(c: Condo) {
    setSelectedCondo(c);
    setQuery(c.name);
    persistCondo(c);
    setOpen(false);
  }

  /* Beach Chairs + Itinerary State */
  const [chairSets, setChairSets] = useState(1);
  const [todayISO, setTodayISO] = useState<string | null>(null);
  useEffect(() => setTodayISO(toISODate(new Date())), []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const days = useMemo(
    () => diffDaysInclusive(startDate, endDate),
    [startDate, endDate]
  );
  const chairsSubtotal = useMemo(
    () => chairsPricePerSet(days) * Math.max(0, chairSets || 0),
    [days, chairSets]
  );

  const [bonfireDay, setBonfireDay] = useState<string | null>(null);
  const [photoDay, setPhotoDay] = useState<string | null>(null);
  const [bonfireDate, setBonfireDate] = useState<string | null>(null);
  const [bonfireTime, setBonfireTime] = useState<string | null>(null);
  const [photoDate, setPhotoDate] = useState<string | null>(null);
  const [photoTime, setPhotoTime] = useState<string | null>(null);

  const subtotal =
    chairsSubtotal +
    (bonfireDay ? PRICES.bonfire : 0) +
    (photoDay ? PRICES.photo : 0);

  /* SAVE itinerary (bookmark) */
  function handleSave() {
    const payload = {
      condo: selectedCondo?.name ?? query,
      chairSets,
      startDate,
      endDate,
      bonfireDay,
      bonfireDate,
      bonfireTime,
      photoDay,
      photoDate,
      photoTime,
      subtotal,
    };
    localStorage.setItem("coastal.itinerary.saved", JSON.stringify(payload));
    alert("Itinerary saved. You can return to it anytime.");
  }

  /* SEND itinerary (native share sheet on iPhone) */
  async function handleSend() {
    const shareData = {
      title: "My Coastal Itinerary",
      text: "Here is my Coastal beach plan — check it out!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log("Share canceled", err);
      }
    }

    // Fallback: copy link
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  }

  function handleCheckout() {
    const payload = {
      condo: selectedCondo?.name ?? query,
      chairSets,
      startDate,
      endDate,
      bonfireDay,
      bonfireDate,
      bonfireTime,
      photoDay,
      photoDate,
      photoTime,
      total: subtotal,
    };
    sessionStorage.setItem("coastal.checkout", JSON.stringify(payload));
    window.location.href = "/checkout";
  }

  /* Toggle */
  const [view, setView] = useState<"packages" | "individual">("packages");

  /* Amenity popup config */
  const AMENITIES: AmenityConfig[] = [
    {
      id: "bonfire",
      name: "Beach Bonfire",
      priceHint: "From $500 • pick a night",
    },
    {
      id: "paddleboard",
      name: "Paddleboard",
      priceHint: "$35+ / hour • multiple launch spots daily",
    },
    {
      id: "photography",
      name: "Family Photography",
      priceHint: "$300 • 45–60 min",
    },
    { id: "jetski", name: "Jet Ski Rentals", priceHint: "$65 • 30 min" },
    { id: "parasail", name: "Parasail", priceHint: "$75 • person" },
    { id: "banana_boat", name: "Banana Boat", priceHint: "$25 • rider" },
  ];

  const [activeAmenity, setActiveAmenity] = useState<AmenityConfig | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  function openAmenity(id: AmenityKind) {
    const a = AMENITIES.find((x) => x.id === id);
    if (!a) return;
    setActiveAmenity(a);
    setModalOpen(true);
  }

  function submitAmenity(payload: AddedItem) {
    if (payload.amenity === "bonfire") {
      const w = weekdayLabel(payload.date);
      setBonfireDay(w || payload.date);
      setBonfireDate(payload.date);
      setBonfireTime(payload.time);
    } else if (payload.amenity === "photography") {
      const w = weekdayLabel(payload.date);
      setPhotoDay(w || payload.date);
      setPhotoDate(payload.date);
      setPhotoTime(payload.time);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 py-8">
      {/* HEADER */}
      {!selectedCondo ? (
        <div className="rounded-2xl border border-sky-100 bg-white shadow-[0_14px_40px_-24px_rgba(2,132,199,0.25)] p-5">
          <h1 className="mb-3 text-2xl md:text-3xl font-bold text-sky-900 tracking-tight">
            Panama City Beach Amenity Suite
          </h1>

          <div ref={wrapperRef} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder="Enter your condo name or address…"
              onChange={(e) => {
                const v = e.target.value.replace(/^\s+/, "");
                setQuery(v);
                setOpen(v.length >= 1);
              }}
              onFocus={() => query.length >= 1 && setOpen(true)}
              className="w-full rounded-lg border border-sky-200 bg-white/85 px-4 py-2 text-sm shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
            {open && filtered.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-lg border border-sky-100 bg-white shadow-lg z-20">
                {filtered.map((c) => (
                  <li
                    key={c.slug}
                    className="cursor-pointer px-4 py-2 hover:bg-sky-50"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleSelectCondo(c);
                    }}
                  >
                    <div className="font-medium text-sky-900">{c.name}</div>
                    <div className="text-xs text-sky-600">{c.address}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-sky-100 bg-sky-50 shadow-[0_14px_40px_-24px_rgba(2,132,199,0.25)] px-4 py-6 md:px-6 md:py-6">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-sky-900 leading-tight truncate">
                {selectedCondo.name}
              </h1>
              <p className="text-sm text-sky-700 truncate">
                {selectedCondo.address}
              </p>

              <button
                onClick={() => {
                  persistCondo(null);
                  setSelectedCondo(null);
                  setOpen(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="mt-3 inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-100"
              >
                Change condo
              </button>
            </div>

            <div className="shrink-0">
              <Image
                src={selectedCondo.logo ?? `/logos/${selectedCondo.slug}.png`}
                alt={`${selectedCondo.name} logo`}
                width={480}
                height={160}
                className="h-[80px] md:h-[96px] w-auto object-contain"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* TOGGLE */}
      <div className="mt-4 mb-3 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
          Amenity Planning
        </span>

        <div className="ml-auto inline-flex rounded-full bg-sky-50 p-1 ring-1 ring-sky-100">
          <button
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              view === "packages"
                ? "bg-white text-sky-900 ring-1 ring-sky-200 shadow-sm"
                : "text-sky-700"
            }`}
            onClick={() => setView("packages")}
          >
            Packages
          </button>

          <button
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              view === "individual"
                ? "bg-white text-sky-900 ring-1 ring-sky-200 shadow-sm"
                : "text-sky-700"
            }`}
            onClick={() => setView("individual")}
          >
            Build Individually
          </button>
        </div>
      </div>

      {/* MAIN VIEW */}
      {view === "packages" ? (
        <AmenityPackages market="pcb" className="mb-8" />
      ) : (
        <>
          {/* ROW: CHAIRS + ITINERARY */}
          <section className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-start">
            {/* CHAIRS CARD — HERO (stacked with big image) */}
            <div className="rounded-[32px] border border-sky-100 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] px-6 pt-5 pb-6 md:px-8">
              {/* Header: title + chips + quantity */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[26px] md:text-[30px] font-black leading-tight tracking-tight text-sky-950">
                    Beach Chairs &amp; Umbrellas
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[12px] font-medium text-sky-900">
                      1 set = 2 chairs + 1 umbrella
                    </span>
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-[12px] text-sky-700">
                      $55/day • $300/week per set
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                    Sets
                  </span>
                  <div className="inline-flex items-center rounded-full border border-sky-200 bg-white shadow-sm">
                    <button
                      onClick={() => setChairSets(Math.max(1, chairSets - 1))}
                      className="px-3 py-2 text-sky-700 hover:bg-sky-50"
                      aria-label="Decrease sets"
                    >
                      −
                    </button>
                    <div className="px-4 text-base font-semibold text-sky-900 min-w-[2rem] text-center">
                      {chairSets}
                    </div>
                    <button
                      onClick={() => setChairSets(chairSets + 1)}
                      className="px-3 py-2 text-sky-700 hover:bg-sky-50"
                      aria-label="Increase sets"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Dates row */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col">
                  <span className="text-xs font-semibold text-sky-900">
                    Start date
                  </span>
                  <input
                    type="date"
                    min={todayISO ?? undefined}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-sky-200 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs font-semibold text-sky-900">
                    End date
                  </span>
                  <input
                    type="date"
                    min={(startDate || todayISO) ?? undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-sky-200 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
                  />
                </label>
              </div>

              {/* Big image */}
              <div className="mt-5">
                <div className="relative h-64 md:h-72 lg:h-80 rounded-[24px] overflow-hidden border border-sky-100">
                  <Image
                    src="/cards/pcb-chairs1.jpg"
                    alt="Chairs & umbrellas set up on Panama City Beach"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-sky-50/95 px-3 py-1 text-[11px] font-medium text-sky-900 shadow-sm border border-sky-100">
                    <span className="mr-1.5 h-4 w-4 rounded-md bg-sky-200" />
                    Beach Chairs &amp; Umbrellas
                  </div>
                </div>
              </div>

              {/* Compact summary (auto feeds itinerary) */}
              <div className="mt-4 flex items-center justify-between text-sky-900">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold">
                    Chairs total
                  </span>
                  <p className="text-[11px] text-sky-600">
                    $55/day per set, capped at $300/week.
                  </p>
                  {startDate && endDate && (
                    <p className="mt-0.5 text-[11px] text-sky-600">
                      {days} {days === 1 ? "day" : "days"} • {chairSets}{" "}
                      {chairSets === 1 ? "set" : "sets"}
                    </p>
                  )}
                </div>
                <span className="text-[18px] md:text-[20px] font-black">
                  ${chairsSubtotal}
                </span>
              </div>
            </div>

            {/* ITINERARY CARD (with Save + Send below) */}
            <aside className="rounded-2xl border border-sky-100 bg-white shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)] p-6">
              <h3 className="text-sm font-semibold text-sky-900">
                Your itinerary
              </h3>

              <dl className="mt-3 space-y-1.5 text-sky-800 text-xs sm:text-sm">
                <div className="flex justify-between gap-4">
                  <dt>Chair sets</dt>
                  <dd className="font-medium">{chairSets}</dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt>Dates</dt>
                  <dd className="font-medium">
                    {startDate ? new Date(startDate).toLocaleDateString() : "—"}{" "}
                    → {endDate ? new Date(endDate).toLocaleDateString() : "—"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt>Bonfire</dt>
                  <dd className="font-medium">
                    {bonfireDay ?? "Not scheduled"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt>Family Photography</dt>
                  <dd className="font-medium">{photoDay ?? "Not scheduled"}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-sky-100 pt-3">
                <div className="flex justify-between text-sm text-sky-900">
                  <span>Total</span>
                  <span className="font-semibold">${subtotal}</span>
                </div>
              </div>

              <button
                className="mt-4 w-full rounded-xl bg-[#0170BF] px-5 py-3 text-sm sm:text-base text-white font-semibold shadow hover:bg-[#0269b3] disabled:opacity-60"
                disabled={!startDate || !endDate || chairSets < 1}
                onClick={handleCheckout}
              >
                Review & Checkout
              </button>

              {/* Save / Send block */}
              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/80 px-4 py-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-800 shadow-sm hover:bg-sky-100"
                >
                  Save itinerary
                </button>

                <button
                  onClick={handleSend}
                  className="flex-1 rounded-xl bg-[#0170BF] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#0269b3]"
                >
                  Send / Share
                </button>
              </div>
            </aside>
          </section>

          {/* Add-ons (cards open modals) */}
          <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article
              className="rounded-xl border border-sky-100 bg-white p-0 shadow-md transition-all hover:shadow-lg overflow-hidden cursor-pointer"
              onClick={() => openAmenity("bonfire")}
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/beach-bonfires2.jpg"
                  alt="Beach Bonfire"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sky-900 font-semibold">
                      Beach Bonfire
                    </h4>
                    <p className="text-sky-700 text-sm">
                      From ${PRICES.bonfire} • pick a night
                    </p>
                  </div>
                  <span className="text-[11px] rounded-full border border-sky-200 px-2 py-0.5 text-sky-700">
                    Include
                  </span>
                </div>
              </div>
            </article>

            <article
              className="rounded-xl border border-sky-100 bg-white p-0 shadow-md transition-all hover:shadow-lg overflow-hidden cursor-pointer"
              onClick={() => openAmenity("paddleboard")}
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/cards/paddle1.jpg"
                  alt="Paddleboard"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h4 className="text-sky-900 font-semibold">Paddleboard</h4>
                <p className="text-sky-700 text-sm">
                  $35+ / hour • multiple launch spots daily
                </p>
              </div>
            </article>

            <article
              className="rounded-xl border border-sky-100 bg-white p-0 shadow-md transition-all hover:shadow-lg overflow-hidden cursor-pointer"
              onClick={() => openAmenity("photography")}
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/cards/photography2.png"
                  alt="Family Photography"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sky-900 font-semibold">
                      Family Photography
                    </h4>
                    <p className="text-sky-700 text-sm">
                      ${PRICES.photo} • 45–60 min
                    </p>
                  </div>
                  <span className="text-[11px] rounded-full border border-sky-200 px-2 py-0.5 text-sky-700">
                    Include
                  </span>
                </div>
              </div>
            </article>
          </section>

          {/* Watersports */}
          <section className="mt-10">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
              Featured
            </div>
            <h3 className="mb-4 text-lg font-semibold text-sky-900">
              Watersports
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article
                className="rounded-xl border border-sky-100 bg-white p-0 shadow-md transition-all hover:shadow-lg overflow-hidden cursor-pointer"
                onClick={() => openAmenity("jetski")}
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/cards/jetski.jpg"
                    alt="Jet Ski Rentals"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sky-900 font-semibold">
                    Jet Ski Rentals
                  </h4>
                  <p className="text-sky-700 text-sm">$65+ / 30 min</p>
                  <p className="mt-1 text-[12px] text-sky-600">
                    Wave-runner thrills right off the beach.
                  </p>
                </div>
              </article>
              <article
                className="rounded-xl border border-sky-100 bg-white p-0 shadow-md transition-all hover:shadow-lg overflow-hidden cursor-pointer"
                onClick={() => openAmenity("parasail")}
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/cards/parasail.jpg"
                    alt="Parasail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sky-900 font-semibold">Parasail</h4>
                  <p className="text-sky-700 text-sm">$75+ / person</p>
                  <p className="mt-1 text-[12px] text-sky-600">
                    Soaring gulf views with pro crews.
                  </p>
                </div>
              </article>
              <article
                className="rounded-xl border border-sky-100 bg-white p-0 shadow-md transition-all hover:shadow-lg overflow-hidden cursor-pointer"
                onClick={() => openAmenity("banana_boat")}
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/cards/banana.jpg"
                    alt="Banana Boat"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sky-900 font-semibold">Banana Boat</h4>
                  <p className="text-sky-700 text-sm">$25+ / rider</p>
                  <p className="mt-1 text-[12px] text-sky-600">
                    Group fun for all ages — hold on!
                  </p>
                </div>
              </article>
            </div>

            <SuiteContextSync market="pcb" mode="pcb" />
          </section>

          {/* Booking Modal */}
          <AmenityModal
            open={modalOpen}
            amenity={activeAmenity}
            onClose={() => setModalOpen(false)}
            onSubmit={submitAmenity}
            condosCSV="/condos_pcb.csv"
          />
        </>
      )}
    </main>
  );
}
