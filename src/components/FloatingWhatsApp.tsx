"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/916383558292"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white/20 group pulse-cta"
      title="Quick Chat on WhatsApp"
      aria-label="Direct WhatsApp Ordering"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-xs pl-0 group-hover:pl-2 text-white">
        Need Help? Chat Now
      </span>
    </a>
  );
};
