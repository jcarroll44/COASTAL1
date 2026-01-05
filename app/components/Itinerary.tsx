"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dialog } from "@headlessui/react";

type DayBooking = {
  date: Date;
  chairs?: number;
  bonfire?: boolean;
  photography?: boolean;
};

type ItineraryProps = {
  week: DayBooking[];
  subtotal: number;
};

export default function Itinerary({ week, subtotal }: ItineraryProps) {
  const [openShare, setOpenShare] = useState(false);
  const [openSave, setOpenSave] = useState(false);

  return (
    <aside className="rounded-3xl border border-sky-100 bg-white p-5 shadow-md sticky top-4">
      {/* Title */}
      <h2 className="text-xl font-bold text-sky-900 mb-4">Your Itinerary</h2>

      {/* DAYS */}
      <div className="space-y-3">
        {week.map((d, i) => (
          <div
            key={i}
            className="rounded-xl border border-sky-100 bg-sky-50/40 p-3"
          >
            <div className="font-semibold text-sky-900">
              {format(d.date, "EEE, MMM d")}
            </div>

            <ul className="mt-1 text-sm text-sky-800 space-y-1">
              {d.chairs ? (
                <li>🪑 {d.chairs} Beach Chair Set{d.chairs > 1 ? "s" : ""}</li>
              ) : null}
              {d.bonfire ? <li>🔥 Bonfire</li> : null}
              {d.photography ? <li>📸 Photography Session</li> : null}

              {!d.chairs && !d.bonfire && !d.photography ? (
                <li className="text-sky-600 italic">No bookings</li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="border-t border-sky-100 mt-6 pt-4">
        <div className="flex justify-between text-lg font-semibold text-sky-900">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        <button className="mt-4 w-full rounded-xl bg-sky-800 py-3 text-white font-semibold hover:brightness-95 transition">
          Continue to Checkout
        </button>
      </div>

      {/* Save + Send Row */}
      <div className="mt-6 flex items-center justify-center gap-3 pt-4 border-t border-sky-100">
        <button
          onClick={() => setOpenSave(true)}
          className="px-4 py-2 rounded-xl border border-sky-300 text-sky-800 font-medium bg-white hover:bg-sky-50 transition"
        >
          Save
        </button>

        <button
          onClick={() => setOpenShare(true)}
          className="px-4 py-2 rounded-xl border border-sky-300 text-sky-800 font-medium bg-white hover:bg-sky-50 transition"
        >
          Send
        </button>
      </div>

      {/* --- SEND MODAL --- */}
      <Dialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-sky-900">
              Share Your Itinerary
            </Dialog.Title>

            <p className="mt-2 text-sm text-sky-700">
              Send your week plan to friends, family, or your group chat.
            </p>

            <div className="mt-4 space-y-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Coastal Beach Service",
                      text: "Here’s our trip itinerary.",
                      url: window.location.href,
                    });
                  }
                }}
                className="w-full py-2 rounded-xl bg-sky-800 text-white font-semibold hover:brightness-95"
              >
                Share via Device
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}
                className="w-full py-2 rounded-xl border border-sky-300 text-sky-800 font-medium hover:bg-sky-50"
              >
                Copy Link
              </button>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setOpenShare(false)}
                className="text-sky-700 font-medium"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* --- SAVE MODAL --- */}
      <Dialog
        open={openSave}
        onClose={() => setOpenSave(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-sky-900">
              Save to Your Phone
            </Dialog.Title>

            <p className="mt-2 text-sm text-sky-700">
              Add Coastal Access to your home screen for fast access to:
            </p>

            <ul className="mt-3 text-sm text-sky-800 space-y-1">
              <li>• Beach Flags</li>
              <li>• Weather</li>
              <li>• Beach Cams</li>
              <li>• Your itinerary</li>
            </ul>

            <div className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-3">
              <p className="text-sm text-sky-800">
                On iPhone: Tap the <strong>Share</strong> icon →{" "}
                <strong>Add to Home Screen</strong>.
              </p>
              <p className="text-sm text-sky-800 mt-2">
                On Android: Tap the menu (⋮) →{" "}
                <strong>Add to Home Screen</strong>.
              </p>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setOpenSave(false)}
                className="text-sky-700 font-medium"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </aside>
  );
}
