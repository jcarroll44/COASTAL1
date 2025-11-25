// app/beach-chairs/page.tsx
import { redirect } from "next/navigation";

export const metadata = {
  title: "Beach Chairs & Umbrellas | Coastal",
};

export default function Page() {
  // point this to your live route for chairs
  redirect("/30a/chairs");
}
