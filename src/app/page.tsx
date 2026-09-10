"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Palette, MessageCircle, Star } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { TrustHighlights } from "@/components/TrustHighlights";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedCakeSelection } from "@/components/FeaturedCakeSelection";

export default function HomePage() {
  const reviews = [
    {
      name: "Priya R.",
      area: "Saravanampatti, Coimbatore",
      text: "The Classic Red Velvet was absolutely fresh and melt-in-the-mouth! Direct ordering on WhatsApp was super quick.",
      rating: 5,
      date: "2 days ago",
    },
    {
      name: "Karthik V.",
      area: "Ganapathy, Coimbatore",
      text: "Ordered a custom theme cake for my son's birthday. Perfect taste and design! Truly MAKE A TEASTY LIFE experience.",
      rating: 5,
      date: "1 week ago",
    },
    {
      name: "Deepa S.",
      area: "RS Puram, Coimbatore",
      text: "Black Forest double layer cake was delicious. Prepared fresh and handed over right on time. Our family loves கேரித் Cakes!",
      rating: 5,
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020001] text-[#FFF7EA]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Highlights */}
      <TrustHighlights />

      {/* 3. Explore Cake Categories (5 cards: Birthday, Anniversary, Fresh Cream, Custom Models, Wedding) */}
      <CategoryGrid />

      {/* 4. Featured Cake Selection Section:
             - Section heading: Featured Cake Selection
             - Category filters (17 filters: All Cakes, Black Forest, Red Velvet, Chocolate, etc.)
             - Search field
             - Filtered cake-product list
             - Sticky Order Now bar handled by Layout */}
      <FeaturedCakeSelection />

      {/* 5. Custom Cake Banner */}
      <section className="py-10 sm:py-14 bg-[#020001] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#C9A24A]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex-1 space-y-2.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold uppercase tracking-wider">
                <Palette size={13} className="text-[#FF8A00]" /> Unique Theme Models
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF7EA] font-serif leading-tight">
                Want a Custom Cake <br />
                <span className="gold-gradient-text">Designed for Your Special Day?</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#DBD8C0] max-w-lg leading-relaxed">
                Send us your custom theme concept, flavour choice, and reference image directly on WhatsApp.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <Link
                  href="/custom-cake"
                  className="orange-glow-btn px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Palette size={15} />
                  <span>Custom Cake Enquiry</span>
                </Link>

                <a
                  href="https://wa.me/916383558292?text=Hello%20%E0%AE%95%E0%AF%87%E0%AE%B0%E0%AE%BF%E0%AE%A4%E0%AF%8D%20Cakes,%20I%20want%20to%20enquire%20about%20a%20custom%20cake."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#241124] border border-[#C9A24A]/40 text-[#FFF7EA] font-semibold text-xs flex items-center gap-1.5"
                >
                  <MessageCircle size={15} className="text-[#25D366]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div className="relative w-full md:w-72 h-48 rounded-2xl overflow-hidden border border-[#C9A24A]/30 shrink-0 shadow-lg">
              <Image
                src="/images/cakes/custom_model.jpg"
                alt="கேரித் Cakes Custom Theme Model"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="py-10 bg-[#120614] border-y border-[#3B1635]">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFF7EA] font-serif">
              Loved in <span className="gold-gradient-text">Coimbatore</span>
            </h2>
            <p className="text-xs text-[#DBD8C0] mt-0.5">
              Fresh cream celebrations made special with கேரித் Cakes (MAKE A TEASTY LIFE)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#0a040b] border border-[#3B1635] flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex text-[#FF8A00] mb-2">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} size={13} fill="#FF8A00" />
                    ))}
                  </div>
                  <p className="text-xs text-[#DBD8C0] italic leading-relaxed">
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
                <div className="pt-2 border-t border-[#241124] flex justify-between items-end text-xs">
                  <div>
                    <strong className="text-[#FFF7EA] block text-xs">{r.name}</strong>
                    <span className="text-[10px] text-[#C9A24A]">{r.area}</span>
                  </div>
                  <span className="text-[9px] text-gray-500">{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
