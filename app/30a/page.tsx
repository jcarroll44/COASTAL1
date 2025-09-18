import OfferingPage from "@/components/OfferingPage";

export default function ThirtyAHome() {
  return (
    <OfferingPage
      title="30A / South Walton"
      subtitle="Chairs, Beach Box, Watersports & Photography"
      heroImage="/hero-30a.jpg"
      items={[
        {
          id: "30a-chairs",
          name: "Beach Chairs & Umbrellas",
          price: "$55/day",
          image: "/cards/chairs-30a.jpg",
          href: "/30a/chairs",
          blurb: "Weekly or daily sets, placed for you.",
        },
        {
          id: "30a-box",
          name: "Beach Better Box",
          price: "$375/week",
          image: "/cards/box.jpg",
          href: "/30a/better-box",
          blurb: "Bundle savings on beach essentials.",
        },
        {
          id: "30a-bonfires",
          name: "Beach Bonfires",
          price: "from $500",
          image: "/cards/bonfire.jpg",
          href: "/30a/bonfires",
          blurb: "Permitted set-up with seating.",
        },
        {
          id: "30a-photo",
          name: "Family Photography",
          price: "$300",
          image: "/cards/photo.jpg",
          href: "/30a/photography",
          blurb: "Golden-hour portraits.",
        },
      ]}
    />
  );
}
