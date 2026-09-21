import { Metadata } from "next";
import CustomCakeClient from "./CustomCakeClient";

export const metadata: Metadata = {
  title: "Custom Cake Designer & Enquiry | கேரித் Cakes Coimbatore",
  description:
    "Design your unique theme cake, wedding multi-tier model, or birthday photo cake with கேரித் Cakes in Coimbatore. Submit your concept and quote via WhatsApp.",
  alternates: {
    canonical: "/custom-cake",
  },
  openGraph: {
    title: "Custom Cake Designer & Enquiry | கேரித் Cakes Coimbatore",
    description:
      "Design your unique theme cake, wedding multi-tier model, or birthday photo cake with கேரித் Cakes in Coimbatore. Submit your concept and quote via WhatsApp.",
    url: "/custom-cake",
    images: [
      {
        url: "/images/cakes/custom_model.jpg",
        width: 800,
        height: 800,
        alt: "கேரித் Cakes Custom Theme Cake Model",
      },
    ],
  },
};

export default function CustomCakePage() {
  return <CustomCakeClient />;
}
