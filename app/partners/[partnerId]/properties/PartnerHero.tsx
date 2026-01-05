"use client";

import Image from "next/image";

export default function PartnerHero({
  partnerId,
  partnerName,
  propertiesCount,
}: {
  partnerId: string;
  partnerName: string;
  propertiesCount: number;
}) {
  // map partner → logo path (extend as needed)
  const logos: Record<string, string> = {
    "30a-escapes": "/30a-escapes1.png",
    "pcb-condos": "/pcb-condos1.png",
  };
  const logoSrc = logos[partnerId] || "/30a-escapes1.png";

  return (
    <section className="mb-6">
      {/* Logo */}
      <div className="flex justify-start items-center gap-4">
        <Image
          src={logoSrc}
          alt={`${partnerName} logo`}
          width={140}
          height={140}
          priority
          className="h-14 w-auto md:h-16 object-contain"
        />

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-sky-900">
            {partnerName}
          </h1>
          <p className="mt-1 text-sky-600 text-sm md:text-[15px]">
            {propertiesCount.toLocaleString()} properties
          </p>
        </div>
      </div>
    </section>
  );
}