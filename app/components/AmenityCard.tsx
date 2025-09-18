"use client";
import Image from "next/image";

interface AmenityCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
}

export default function AmenityCard({
  id,
  title,
  price,
  description,
  image,
}: AmenityCardProps) {
  return (
    <div
      key={id}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="relative w-full h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-base font-medium mt-2">{price}</p>
      </div>
    </div>
  );
}
