// app/page.tsx
import Hero from "@/components/Hero"; // <-- your updated rotating Hero
import ServicesCarousel from "@/components/ServicesCarousel";
import Legacy from "@/components/Legacy";
import MarketLanding from "@/components/MarketLanding";

export default function HomePage() {
  const services = [
    {
      title: "Chairs & Umbrellas",
      blurb: "Daily setup & takedown—placed with care.",
      badge: "Signature Service",
      image: "/cards/chairs-30a.jpg",
      href: "/pcb/chairs",
    },
    {
      title: "Beach Bonfires",
      blurb: "Permits, fire, seating, & s’mores handled.",
      badge: "Signature Service",
      image: "/cards/bonfire.jpg",
      href: "/pcb/bonfires",
    },
    {
      title: "Jet Skis",
      blurb: "Thrill rides on the emerald water.",
      image: "/cards/jetski.jpg",
      href: "/pcb/jetskis",
    },
    {
      title: "Parasail",
      blurb: "Soar high with the safest crews on the coast.",
      image: "/cards/parasail.jpg",
      href: "/pcb/parasail",
    },
    {
      title: "Beach Better Box",
      blurb: "Cooler, towels & beach-day essentials—bundled.",
      image: "/cards/box.jpg",
      href: "/30a/beach-better-box",
    },
    {
      title: "Boat Rentals",
      blurb: "Pontoon days made easy.",
      image: "/cards/pontoon.jpg",
      href: "/pcb/boat-rentals",
    },
    {
      title: "Family Photography",
      blurb: "Golden-hour sessions, edited & delivered.",
      image: "/cards/photo.jpg",
      href: "/pcb/photography",
    },
    {
      title: "Watersports (PCB)",
      blurb: "Parasail, jet skis, banana boat & more.",
      image: "/cards/watersports.jpg",
      href: "/pcb/water-sports",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100">
      {/* Rotating hero */}
      <section className="relative z-0">
        <Hero
          images={["/hero3.jpg", "/hero.jpg", "/hero1.jpg"]}
          interval={6000}
        />
      </section>

      {/* Signature Services — force on top & add spacing */}
      <section className="relative z-[1] mx-auto max-w-7xl px-5 pt-8 md:px-8 md:pt-12">
        <ServicesCarousel
          items={services}
          kicker="Beach Essentials by Coastal"
          title="Signature Services – All in One Place."
          // if your component accepts a 'stationary' or 'variant' prop, enable it:
          // stationary
          // variant="stationary"
        />
      </section>

      <Legacy />
      <MarketLanding />
    </main>
  );
}
