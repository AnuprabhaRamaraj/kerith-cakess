import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Bakery Location Ganapathy | கேரித் Cakes Coimbatore",
  description:
    "Visit கேரித் Cakes in Ganapathy, Coimbatore (Opposite Surya Hospital, Sathy Main Road). Reach out for orders and queries via WhatsApp: +91 63835 58292.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Bakery Location Ganapathy | கேரித் Cakes Coimbatore",
    description:
      "Visit கேரித் Cakes in Ganapathy, Coimbatore (Opposite Surya Hospital, Sathy Main Road). Reach out for orders and queries via WhatsApp: +91 63835 58292.",
    url: "/contact",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 800,
        alt: "கேரித் Cakes Bakery Location in Ganapathy Coimbatore",
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
