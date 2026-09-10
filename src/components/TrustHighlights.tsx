"use client";

import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export const TrustHighlights: React.FC = () => {
  const highlights = [
    {
      title: "FRESH",
      subtitle: "Freshly prepared for every order",
      icon: Sparkles,
      color: "text-[#C1DD13]",
      bg: "bg-[#C1DD13]/10 border-[#C1DD13]/30",
    },
    {
      title: "HYGIENIC",
      subtitle: "Carefully prepared and packed",
      icon: ShieldCheck,
      color: "text-[#C9A24A]",
      bg: "bg-[#C9A24A]/10 border-[#C9A24A]/30",
    },
    {
      title: "TEASTY",
      subtitle: "MAKE A TEASTY LIFE with fresh cream",
      icon: HeartHandshake,
      color: "text-[#FF8A00]",
      bg: "bg-[#FF8A00]/10 border-[#FF8A00]/30",
    },
    {
      title: "COIMBATORE",
      subtitle: "Local Ganapathy order & delivery",
      icon: MapPin,
      color: "text-white",
      bg: "bg-[#3B1635]/80 border-[#C9A24A]/30",
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#120614]/60 border-y border-[#3B1635]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className={`p-3 sm:p-4 rounded-2xl border ${h.bg} backdrop-blur-sm flex items-center gap-2.5 sm:gap-3.5 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className={`p-2 sm:p-2.5 rounded-xl bg-[#020001]/80 ${h.color} shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className={`font-black text-xs sm:text-sm tracking-wider ${h.color} truncate`}>{h.title}</h4>
                  <p className="text-[10px] sm:text-xs text-[#DBD8C0] mt-0.5 font-medium truncate">{h.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
