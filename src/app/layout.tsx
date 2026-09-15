import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "கேரித் Cakes | Fresh Cream & Custom Cakes in Coimbatore",
  description:
    "MAKE A TEASTY LIFE — Order fresh, hygienic and tasty celebration cakes from கேரித் Cakes in Ganapathy, Coimbatore. Select your favourite cakes and place your complete order through WhatsApp.",
  keywords: [
    "கேரித் Cakes",
    "MAKE A TEASTY LIFE",
    "Fresh cream cakes in Coimbatore",
    "Birthday cakes in Ganapathy",
    "Custom cakes in Coimbatore",
    "Cake shop near Surya Hospital",
    "WhatsApp cake ordering in Coimbatore",
  ],
  authors: [{ name: "கேரித் Cakes" }],
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  openGraph: {
    title: "கேரித் Cakes | Fresh Cream & Custom Cakes in Coimbatore",
    description:
      "MAKE A TEASTY LIFE — Fresh, hygienic & tasty celebration cakes in Ganapathy, Coimbatore. Order online & dispatch via WhatsApp.",
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 800,
        alt: "கேரித் Cakes Official Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-[#020001] text-[#FFF7EA] antialiased selection:bg-[#FF8A00] selection:text-white">
        <ProductsProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileBottomBar />
            <FloatingWhatsApp />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
