// app/page.tsx
import Hero from "@/components/Hero";
import ServicesCarousel from "@/components/ServicesCarousel";
import Legacy from "@/components/Legacy";
import MarketLanding from "@/components/MarketLanding";

export default function HomePage() {
  // Cards for the 4-up endless carousel
  const services = [
    {
      title: "Chairs & Umbrellas",
      blurb: "Daily setup & takedown—placed with care.",
      badge: "Signature Service",
      image: "/cards/chairs-30a.jpg",
      href: "/chairs",
    },
    {
      title: "Beach Bonfires",
      blurb: "Permits, fire, seating, & s’mores handled.",
      badge: "Signature Service",
      image: "/cards/bonfire.jpg",
      href: "/bonfires",
    },
    {
      title: "Jet Skis",
      blurb: "Thrill rides on the emerald water.",
      image: "/cards/jetski.jpg",
      href: "/watersports#jetskis",
    },
    {
      title: "Parasail",
      blurb: "Soar high with the safest crews on the coast.",
      image: "/cards/parasail.jpg",
      href: "/watersports#parasail",
    },
    {
      title: "Beach Better Box",
      blurb: "Cooler, towels & beach-day essentials—bundled.",
      image: "/cards/box.jpg",
      href: "/box",
    },
    {
      title: "Boat Rentals",
      blurb: "Pontoon days made easy.",
      image: "/cards/pontoon.jpg",
      href: "/boats",
    },
    {
      title: "Family Photography",
      blurb: "Golden-hour sessions, edited & delivered.",
      image: "/cards/photo.jpg",
      href: "/photography",
    },
    {
      title: "Watersports (PCB)",
      blurb: "Parasail, jet skis, paddleboards & more.",
      image: "/cards/watersports.jpg",
      href: "/watersports",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100">
      {/* Hero */}
      <Hero image="/hero.jpg" />

      {/* Signature Services — 4-up endless carousel */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-14">
        <ServicesCarousel items={services} />
      </section>

      {/* Brand story (no “Build Your Week” inside this section) */}
      <Legacy />

      {/* Choose your area: PCB / 30A */}
      <MarketLanding />
    </main>
  );
}
