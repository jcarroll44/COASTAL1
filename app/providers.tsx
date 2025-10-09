// app/providers.tsx
"use client";
import { ItineraryProvider } from "@/components/Itinerary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ItineraryProvider>{children}</ItineraryProvider>;
}
