import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Your Selected Cakes & Order Cart | கேரித் Cakes Coimbatore",
  description:
    "Review your selected cakes, customized weight portions, and dispatch your order directly to கேரித் Cakes via WhatsApp.",
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: "Your Selected Cakes & Order Cart | கேரித் Cakes Coimbatore",
    description:
      "Review your selected cakes, customized weight portions, and dispatch your order directly to கேரித் Cakes via WhatsApp.",
    url: "/cart",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 800,
        alt: "கேரித் Cakes WhatsApp Cart",
      },
    ],
  },
};

export default function CartPage() {
  return <CartClient />;
}
