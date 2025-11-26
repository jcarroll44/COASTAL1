"use client";

import Image from "next/image";

export default function PropertyHero({
  partnerId,
  propertyName,
  address,
}: {
  partnerId: string;
  propertyName: string;
  address?: string;
}) {
  const logos: Record<string, string> = {
    "30a-escapes": "/30a-escapes1.png",
    "pcb-condos": "/pcb-condos1.png",
  };
  const logoSrc = logos[partnerId] || "/30a-escapes1.png";

  return (
    <section className="relative">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src={logoSrc}
          alt="Partner logo"
          width={230}
          height={230}
          priority
          className="h-24 w-auto md:h-[110px] object-contain"
        />
      </div>

      {/* Title + Address */}
      <div className="mt-6 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-sky-900">
          {propertyName}
        </h1>
        {address && (
          <p className="mt-2 text-sky-600 text-sm md:text-[15px] leading-relaxed">
            {address}
          </p>
        )}
      </div>
    </section>
  );
}