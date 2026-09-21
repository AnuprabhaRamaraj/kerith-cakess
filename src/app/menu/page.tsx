import { Metadata } from "next";
import MenuPageClient from "./MenuPageClient";

export const metadata: Metadata = {
  title: "Cake Menu & Live Catalogue | கேரித் Cakes Coimbatore",
  description:
    "Explore our complete cake menu including Black Forest, Red Velvet, Chocolate Truffle, Butterscotch, Cassata, Rasmalai, and Spanish Delight. Order fresh on WhatsApp.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Cake Menu & Live Catalogue | கேரித் Cakes Coimbatore",
    description:
      "Explore our complete cake menu including Black Forest, Red Velvet, Chocolate Truffle, Butterscotch, Cassata, Rasmalai, and Spanish Delight. Order fresh on WhatsApp.",
    url: "/menu",
    images: [
      {
        url: "/images/cakes/black_forest.jpg",
        width: 800,
        height: 800,
        alt: "கேரித் Cakes Fresh Celebration Cakes",
      },
    ],
  },
};

export default function MenuPage() {
  return <MenuPageClient />;
}
