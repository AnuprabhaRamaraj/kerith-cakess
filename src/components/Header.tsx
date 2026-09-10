"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, MessageCircle, Phone, ArrowRight, BookOpen } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, grandTotal, directOrderOnWhatsApp } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Custom Cake", href: "/custom-cake" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const whatsappUrl = "https://wa.me/916383558292";

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
        {/* Top notification bar (Hidden on very small mobile) */}
        <div className="bg-gradient-to-r from-[#241124] via-[#3B1635] to-[#241124] border-b border-[#C9A24A]/20 text-xs py-1 px-3 sm:px-4 text-center text-[#DBD8C0]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#FFF7EA]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C1DD13] animate-pulse"></span>
              Freshly Prepared Cakes • Ganapathy, Coimbatore
            </span>
            <span className="mx-auto sm:mx-0 font-medium text-[#C9A24A] text-[11px] sm:text-xs">
              Call / WhatsApp: <a href="tel:+916383558292" className="hover:underline text-[#FFF7EA]">+91 63835 58292</a>
            </span>
            <a
              href="https://wa.me/c/916383558292"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-[#FF8A00] hover:text-[#FFF7EA] transition-colors"
            >
              Catalogue <ArrowRight size={12} />
            </a>
          </div>
        </div>

        {/* Main Header Container (Height 64px–72px, perfectly aligned from 320px up) */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Left: Logo + Vertical Brand Text Container */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1 sm:flex-initial"
          >
            {/* Logo: approx 34-40px */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#C9A24A]/60 shadow-md group-hover:border-[#FF8A00] transition-colors bg-[#020001] shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="கேரித் Cakes Official Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Vertical Brand-text container: Never overlaps right icons */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <span
                className="font-bold text-[#FFF7EA] group-hover:text-[#C9A24A] transition-colors font-serif leading-[1.1] truncate"
                style={{
                  fontSize: "clamp(0.92rem, 4.2vw, 1.35rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                கேரித் Cakes
              </span>
              <span
                className="text-[#C9A24A] font-extrabold uppercase tracking-wider leading-[1.2] truncate"
                style={{
                  fontSize: "clamp(0.48rem, 2.1vw, 0.72rem)",
                }}
              >
                MAKE A TEASTY LIFE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#FF8A00] bg-[#3B1635]/60 border border-[#FF8A00]/30"
                      : "text-[#DBD8C0] hover:text-[#FFF7EA] hover:bg-[#241124]/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Cart Icon Link */}
            <Link
              href="/menu"
              className="relative p-2 sm:p-2.5 rounded-xl bg-[#241124] border border-[#C9A24A]/30 hover:border-[#C9A24A] text-[#FFF7EA] transition-all duration-200 group flex items-center gap-1.5"
              title="View Selected Cakes"
            >
              <ShoppingBag size={18} className="text-[#C9A24A] group-hover:scale-110 transition-transform" />
              {totalItemsCount > 0 && (
                <>
                  <span className="text-xs font-bold text-[#FFF7EA]">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-[#FF8A00] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                </>
              )}
            </Link>

            {/* Direct WhatsApp Action */}
            <button
              onClick={totalItemsCount > 0 ? directOrderOnWhatsApp : () => window.open(whatsappUrl, "_blank")}
              className="orange-glow-btn px-3.5 py-2 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>{totalItemsCount > 0 ? "Order Now" : "WhatsApp"}</span>
            </button>
          </div>

          {/* Mobile Right Controls: Fixed Compact Width, Never overlapping */}
          <div className="flex items-center gap-1.5 shrink-0 sm:hidden">
            {/* Cart Icon Mobile */}
            <Link
              href="/menu"
              className="relative p-2 rounded-lg bg-[#241124] border border-[#C9A24A]/30 text-[#FFF7EA]"
              aria-label="View Cart and Menu"
            >
              <ShoppingBag size={18} className="text-[#C9A24A]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF8A00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Catalogue Link Mobile */}
            <a
              href="https://wa.me/c/916383558292"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#241124] border border-[#C9A24A]/30 text-[#C9A24A]"
              title="WhatsApp Catalogue"
              aria-label="WhatsApp Catalogue"
            >
              <BookOpen size={18} />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#241124] border border-[#C9A24A]/30 text-[#FFF7EA] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#020001]/90 backdrop-blur-md flex flex-col justify-between p-6 animate-fadeIn">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#C9A24A]/20">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/logo.jpg"
                  alt="கேரித் Cakes Logo"
                  width={36}
                  height={36}
                  className="rounded-full border border-[#C9A24A]"
                />
                <div className="flex flex-col">
                  <h2 className="font-bold text-base text-[#FFF7EA]">கேரித் Cakes</h2>
                  <p className="text-[9px] text-[#C9A24A] font-bold tracking-wider uppercase">
                    MAKE A TEASTY LIFE
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-[#241124] text-[#DBD8C0]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-2.5 mt-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#3B1635] text-[#FF8A00] border border-[#FF8A00]/40"
                        : "text-[#DBD8C0] hover:text-white hover:bg-[#241124]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-[#C9A24A]/20">
            {totalItemsCount > 0 ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  directOrderOnWhatsApp();
                }}
                className="w-full orange-glow-btn py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                <span>Order {totalItemsCount} Items on WhatsApp (₹{grandTotal.toLocaleString("en-IN")})</span>
              </button>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full orange-glow-btn py-3 rounded-xl text-white font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            )}

            <a
              href="tel:+916383558292"
              className="w-full py-2.5 rounded-xl bg-[#3B1635] text-[#DBD8C0] font-medium text-center flex items-center justify-center gap-2 border border-[#C9A24A]/30 text-xs"
            >
              <Phone size={14} className="text-[#C9A24A]" />
              Call +91 63835 58292
            </a>
          </div>
        </div>
      )}
    </>
  );
};
