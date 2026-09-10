"use client";

import React from "react";
import { MessageCircle, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const MobileBottomBar: React.FC = () => {
  const { totalItemsCount, grandTotal, directOrderOnWhatsApp, clearCart } = useCart();

  if (totalItemsCount === 0) return null;

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your selected cake order?")) {
      clearCart();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#160b18]/95 border-t border-[#C9A24A]/40 backdrop-blur-md px-3 py-2.5 sm:py-3 shadow-2xl animate-slideUp">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left Info: Items Count & Estimated Grand Total */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] sm:text-xs text-[#C9A24A] font-bold tracking-wide truncate">
              {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} Selected
            </span>
            <span className="text-base sm:text-lg font-black text-white leading-tight truncate">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#241124] transition-colors ml-1"
            title="Clear Selection"
            aria-label="Clear selection"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Right CTA Button: Direct WhatsApp Order */}
        <button
          onClick={directOrderOnWhatsApp}
          className="orange-glow-btn px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer active:scale-95"
        >
          <MessageCircle size={18} className="shrink-0" />
          <span>Order Now</span>
          <ArrowRight size={14} className="hidden sm:inline" />
        </button>
      </div>
    </div>
  );
};
