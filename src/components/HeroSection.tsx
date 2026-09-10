"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles, Star, Award } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16 lg:py-20 bg-gradient-to-b from-[#020001] via-[#1a0b1b] to-[#020001]">
      {/* Background Decorative Gold Light Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3B1635] rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-[#C9A24A]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B1635] border border-[#C9A24A]/40 text-[#C9A24A] text-xs font-bold tracking-wider uppercase shadow-md">
              <Sparkles size={14} className="text-[#FF8A00]" />
              <span>Coimbatore Fresh Cakes</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF7EA] tracking-tight leading-[1.15] font-serif">
              Fresh Cream Cakes for <br />
              <span className="gold-gradient-text">Every Celebration</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#DBD8C0] max-w-2xl leading-relaxed">
              Welcome to <strong className="text-[#FFF7EA]">கேரித் Cakes</strong> — fresh, hygienic and tasty fresh cream cakes made with love for birthdays, anniversaries, weddings and every special moment.
            </p>

            {/* Tagline Pill */}
            <div className="inline-block px-3 py-1 rounded-lg bg-[#241124] border border-[#C9A24A]/30 text-[#C9A24A] text-xs font-black tracking-widest uppercase">
              MAKE A TEASTY LIFE
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
              <Link
                href="/menu"
                className="orange-glow-btn px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 group w-full sm:w-auto text-center"
              >
                <span>Explore Cakes</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://wa.me/c/916383558292"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#241124] border border-[#C9A24A] text-[#FFF7EA] hover:bg-[#3B1635] hover:border-[#FF8A00] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-center"
              >
                <span>View WhatsApp Catalogue</span>
                <ExternalLink size={16} className="text-[#C9A24A]" />
              </a>
            </div>

            {/* Social Trust Indicators */}
            <div className="pt-4 border-t border-[#3B1635] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#DBD8C0]">
              <div className="flex items-center gap-2">
                <div className="flex text-[#FF8A00]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#FF8A00" />
                  ))}
                </div>
                <span className="font-bold text-[#FFF7EA]">4.9 / 5</span>
                <span>(500+ Happy Customers)</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#C1DD13] font-semibold">
                <Award size={14} />
                <span>100% Fresh Cream Quality</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-[#C9A24A]/25 via-[#FF8A00]/25 to-[#3B1635]/60 blur-lg opacity-75" />

              <div className="relative rounded-3xl overflow-hidden border-2 border-[#C9A24A]/50 shadow-2xl bg-[#241124] aspect-[4/3]">
                <Image
                  src="/images/cakes/custom_model.jpg"
                  alt="கேரித் Cakes Celebration Cake"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020001]/90 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#020001]/85 backdrop-blur-md border border-[#C9A24A]/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#FFF7EA]">Golden Royalty Custom Cake</h4>
                    <p className="text-[10px] text-[#C9A24A]">Ganapathy, Coimbatore</p>
                  </div>
                  <span className="text-base sm:text-lg font-black text-[#FF8A00]">₹2,400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
