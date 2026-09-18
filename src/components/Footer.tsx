"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, MessageCircle, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { TermsPrivacyModal } from "./TermsPrivacyModal";

export const Footer: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"privacy" | "terms">("privacy");

  const openLegalModal = (tab: "privacy" | "terms") => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const googleMapsLink =
    "https://www.google.com/maps/search/?api=1&query=148,+Kannimar+Nagar,+Sathy+Main+Road,+Ganapathy,+Coimbatore+-+641006";

  return (
    <>
      <footer className="bg-gradient-to-b from-[#020001] via-[#1a0c1b] to-[#020001] border-t border-[#3B1635] pt-12 pb-24 md:pb-12 text-[#DBD8C0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Brand Info */}
            <div className="flex flex-col gap-3">
              <Link
                href="/user/dashboard"
                className="flex items-center gap-3 group transition-transform hover:opacity-95"
                title="Open கேரித் Cakes User Dashboard"
              >
                <Image
                  src="/images/logo.jpg"
                  alt="கேரித் Cakes Logo"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-[#C9A24A] shadow-md shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-xl text-[#FFF7EA] font-serif group-hover:text-[#FF8A00] transition-colors">
                    கேரித் Cakes
                  </h3>
                  <p className="text-[10px] text-[#FF8A00] font-extrabold tracking-wider uppercase">
                    MAKE A TEASTY LIFE
                  </p>
                </div>
              </Link>
              <p className="text-xs leading-relaxed text-[#DBD8C0]">
                Coimbatore’s trusted bakery for fresh cream celebration cakes, customized theme models, and wedding tiers.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold lime-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C1DD13] animate-ping"></span>
                  Fresh Preparation Daily
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-bold text-[#FFF7EA] text-sm border-b border-[#3B1635] pb-1.5">
                Navigation
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link href="/" className="hover:text-[#FF8A00] transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-[#FF8A00] transition-colors">
                    Cake Catalogue & Menu
                  </Link>
                </li>
                <li>
                  <Link href="/custom-cake" className="hover:text-[#FF8A00] transition-colors">
                    Custom Cake Enquiry
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#FF8A00] transition-colors">
                    Photo Gallery
                  </Link>
                </li>
                {/* <li>
                  <Link href="/user/dashboard" className="hover:text-[#FF8A00] text-[#C9A24A] font-semibold transition-colors flex items-center gap-1">
                    <span>⚙️</span> Admin Portal
                  </Link>
                </li> */}
                <li>
                  <Link href="/contact" className="hover:text-[#FF8A00] transition-colors">
                    Store Location & Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Address */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-bold text-[#FFF7EA] text-sm border-b border-[#3B1635] pb-1.5">
                Store Address
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#C9A24A] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <Link
                      href="/user/dashboard"
                      className="text-[#FFF7EA] hover:text-[#FF8A00] font-bold transition-colors"
                      title="Open User Dashboard"
                    >
                      கேரித் Cakes
                    </Link>
                    <br />
                    148, Kannimar Nagar, Sathy Main Road,
                    <br />
                    Ganapathy, Coimbatore – 641006
                    <br />
                    <span className="text-[#FF8A00] font-medium">Near Surya Hospital</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Phone size={15} className="text-[#C9A24A] shrink-0" />
                  <a href="tel:+916383558292" className="hover:text-[#FF8A00] font-bold text-white">
                    +91 63835 58292
                  </a>
                </div>
                <div>
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#C9A24A] hover:underline"
                  >
                    Google Maps Directions <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: WhatsApp Actions */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-bold text-[#FFF7EA] text-sm border-b border-[#3B1635] pb-1.5">
                Direct WhatsApp
              </h4>
              <p className="text-xs text-[#DBD8C0]">
                Select cakes and order directly with our baker on WhatsApp.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://wa.me/916383558292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="orange-glow-btn py-2 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>

                <a
                  href="https://wa.me/c/916383558292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-[#241124] border border-[#C9A24A]/40 text-[#FFF7EA] hover:border-[#C9A24A] font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={13} className="text-[#C9A24A]" />
                  WhatsApp Catalogue
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 border-t border-[#3B1635] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-center md:text-left text-[#DBD8C0]">
              © {new Date().getFullYear()}{" "}
              <Link
                href="/user/dashboard"
                className="hover:text-[#FF8A00] font-semibold transition-colors text-white"
                title="Go to User Dashboard"
              >
                கேரித் Cakes
              </Link>{" "}
              (MAKE A TEASTY LIFE). All rights reserved.
            </p>
            <div className="text-center text-[11px] text-[#DBD8C0]">
              Developed by{" "}
              <span className="text-[#C9A24A] font-bold tracking-wide">
                GK infotech
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openLegalModal("privacy")}
                className="hover:text-[#FF8A00] transition-colors flex items-center gap-1"
              >
                <ShieldCheck size={13} className="text-[#C9A24A]" /> Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => openLegalModal("terms")}
                className="hover:text-[#FF8A00] transition-colors"
              >
                Terms and Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      <TermsPrivacyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
      />
    </>
  );
};
