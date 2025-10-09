// app/suite/pcb/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import PCBAmenitySuitePage from "../page";

export default function PcbSuiteSlugPage() {
  const params = useParams();
  const slug = (params?.slug as string) || undefined;
  return <PCBAmenitySuitePage initialSlug={slug} />;
}
