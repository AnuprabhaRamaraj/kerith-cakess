import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://kerithcakes.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "கேரித் Cakes | Fresh Cream & Custom Cakes in Coimbatore",
    template: "%s | கேரித் Cakes",
  },
  description:
    "MAKE A TEASTY LIFE — Order fresh, hygienic and tasty celebration cakes from கேரித் Cakes in Ganapathy, Coimbatore. Select your favourite cakes and place your complete order through WhatsApp.",
  keywords: [
    "கேரித் Cakes",
    "MAKE A TEASTY LIFE",
    "Fresh cream cakes in Coimbatore",
    "Birthday cakes in Ganapathy",
    "Custom cakes in Coimbatore",
    "Wedding cakes Coimbatore",
    "Cake shop near Surya Hospital Ganapathy",
    "WhatsApp cake ordering in Coimbatore",
  ],
  authors: [{ name: "கேரித் Cakes" }],
  creator: "கேரித் Cakes",
  publisher: "கேரித் Cakes",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  openGraph: {
    title: "கேரித் Cakes | Fresh Cream & Custom Cakes in Coimbatore",
    description:
      "MAKE A TEASTY LIFE — Fresh, hygienic & tasty celebration cakes in Ganapathy, Coimbatore. Order online & dispatch via WhatsApp.",
    url: "/",
    siteName: "கேரித் Cakes",
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
  twitter: {
    card: "summary_large_image",
    title: "கேரித் Cakes | Fresh Cream & Custom Cakes in Coimbatore",
    description:
      "MAKE A TEASTY LIFE — Fresh cream celebration cakes in Ganapathy, Coimbatore. Order via WhatsApp.",
    images: ["/images/logo.jpg"],
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
        <GoogleAnalytics />
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
