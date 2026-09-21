import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Cake Photo Gallery & Masterpieces | கேரித் Cakes Coimbatore",
  description:
    "Explore our photo showcase of freshly baked Black Forest, Red Velvet, 3D theme cakes, and multi-tier wedding cakes prepared in Coimbatore.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Cake Photo Gallery & Masterpieces | கேரித் Cakes Coimbatore",
    description:
      "Explore our photo showcase of freshly baked Black Forest, Red Velvet, 3D theme cakes, and multi-tier wedding cakes prepared in Coimbatore.",
    url: "/gallery",
    images: [
      {
        url: "/images/cakes/wedding_cake.jpg",
        width: 800,
        height: 800,
        alt: "கேரித் Cakes Celebration Gallery",
      },
    ],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
