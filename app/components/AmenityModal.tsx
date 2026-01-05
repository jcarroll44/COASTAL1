"use client";

import { useEffect, useMemo, useState } from "react";
import { useCondosCSV, useFiltered } from "@/app/hooks/useCondos";

export type AmenityKind =
  | "banana_boat"
  | "bonfire"
  | "parasail"
  | "paddleboard"
  | "jetski"
  | "photography";

export type AmenityConfig = {
  id: AmenityKind;
  name: string;
  blurb?: string;
  priceHint?: string;
};

type BaseForm = {
  date: string;
  time: string;
  partySize: number;
  condo: string;
  notes?: string;
};

type BonfireForm = BaseForm & {
  seatingTier: "up_to_8" | "up_to_12" | "up_to_20";
  addons: { smores: boolean; extraHour: boolean; bluetoothSpeaker: boolean };
};

type Props = {
  open: boolean;
  onClose: () => void;
  amenity: AmenityConfig | null;
  onSubmit: (payload: any) => void; // you can wire to your cart later
  condosCSV?: string; // defaults to /condos_pcb.csv
};

export default function AmenityModal({
  open,
  onClose,
  amenity,
  onSubmit,
  condosCSV = "/condos_pcb.csv",
}: Props) {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [condoQuery, setCondoQuery] = useState("");
  const [condo, setCondo] = useState("");
  const [notes, setNotes] = useState("");

  // bonfire specifics
  const [seatingTier, setSeatingTier] =
    useState<BonfireForm["seatingTier"]>("up_to_8");
  const [addons, setAddons] = useState<BonfireForm["addons"]>({
    smores: false,
    extraHour: false,
    bluetoothSpeaker: false,
  });

  // condos
  const { condos, loading, error } = useCondosCSV(condosCSV);
  const filtered = useFiltered(condos, condoQuery);

  useEffect(() => {
    if (open) {
      // reset minimal fields when newly opened for a different amenity
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

  const title = amenity?.name ?? "Amenity";
  const price = amenity?.priceHint;

  const canSubmit = useMemo(() => {
    return Boolean(date && time && condo);
  }, [date, time, condo]);

  if (!open || !amenity) return null;

  function submit() {
    const base: BaseForm = { date, time, partySize, condo, notes };
    const payload =
      amenity.id === "bonfire"
        ? {
            amenity: amenity.id,
            ...base,
            seatingTier,
            addons,
          }
        : { amenity: amenity.id, ...base };
    onSubmit(payload);
    onClose();
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 mx-3 sm:mx-0 animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-bottom-0">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
              {price ? (
                <p className="text-slate-600 mt-1 text-sm">{price}</p>
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

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0170BF]/30"
                />
              </label>

              <label className="block text-sm font-medium">
                Time
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0170BF]/30"
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

            {/* Condo selector with filter */}
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
              <div className="h-[170px] overflow-auto rounded-xl border border-slate-200">
                {loading ? (
                  <div className="p-3 text-sm text-slate-500">Loading…</div>
                ) : error ? (
                  <div className="p-3 text-sm text-rose-600">{error}</div>
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

          {/* Amenity-specific fields */}
          {amenity.id === "bonfire" && (
            <div className="mt-6 border-t pt-6">
              <h4 className="text-sm font-semibold mb-3">Bonfire options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-medium">
                  Seating tier
                  <select
                    value={seatingTier}
                    onChange={(e) =>
                      setSeatingTier(
                        e.target.value as BonfireForm["seatingTier"]
                      )
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

          {/* Notes */}
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

          {/* Actions */}
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