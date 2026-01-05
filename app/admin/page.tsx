// app/admin/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const partners = [
    {
      id: "30a-escapes",
      name: "30A Escapes",
      logo: "/logos/30a-escapes1.png",
      href: "/partners/30a-escapes/properties", // ✅ fixed route
    },
    {
      id: "pcb-condos",
      name: "PCB Condos",
      logo: "/logos/pcb-condos1.png",
      href: "/admin/pcb-condos",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-brand mb-10 text-center">
        Coastal Admin Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 gap-8">
        {partners.map((partner) => (
          <Link
            key={partner.id}
            href={partner.href}
            className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={120}
                className="object-contain drop-shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-sky-900">
                {partner.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                View Partner Dashboard
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
