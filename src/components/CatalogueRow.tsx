"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Star, Info } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface CatalogueRowProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const CatalogueRow: React.FC<CatalogueRowProps> = ({ product, onOpenDetails }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [selectedWeight] = useState(product.weight);

  // Check if item is in cart
  const cartItem = cart.find(
    (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, selectedWeight, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, selectedWeight, -1);
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className="group relative flex items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#0f0710]/90 border border-[#3B1635]/80 hover:border-[#C9A24A]/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* 1. Left: Square Cake Image (72px - 82px) */}
      <div className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-xl overflow-hidden bg-[#241124] shrink-0 border border-[#C9A24A]/25">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="84px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isOffer && (
          <span className="absolute top-1 left-1 bg-[#FF8A00] text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow">
            OFFER
          </span>
        )}
      </div>

      {/* 2. Centre: Flexible Cake Information (min-width: 0) */}
      <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#C9A24A] transition-colors leading-snug truncate">
          {product.name}
        </h3>

        {/* Weight & Category / Short description */}
        <p className="text-xs text-[#DBD8C0]/70 truncate mt-0.5">
          {product.weight} • {product.description}
        </p>

        {/* Pricing Row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm sm:text-base font-extrabold text-[#FFF7EA]">
            ₹{product.offerPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-[#DBD8C0]/50 line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
          {product.rating && (
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] text-[#FF8A00] font-bold ml-1">
              <Star size={10} fill="#FF8A00" />
              {product.rating}
            </span>
          )}
        </div>
      </div>

      {/* 3. Right: Add Button or Interactive Stepper (Fixed width, never overflows) */}
      <div
        className="shrink-0 flex items-center justify-end"
        onClick={(e) => e.stopPropagation()}
      >
        {quantity === 0 ? (
          /* Single Dark Rounded-Square Plus Button (42px-48px) */
          <button
            onClick={handleInitialAdd}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#241124] hover:bg-[#3B1635] text-[#FF8A00] border border-[#C9A24A]/40 hover:border-[#FF8A00] flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95"
            aria-label={`Add ${product.name} to order`}
          >
            <Plus size={22} className="stroke-[2.5]" />
          </button>
        ) : (
          /* Expanded Stepper: [-] [Qty] [+] */
          <div className="flex items-center h-11 sm:h-12 bg-[#241124] border border-[#FF8A00] rounded-xl overflow-hidden shadow-md">
            <button
              onClick={handleDecrement}
              className="w-9 h-full flex items-center justify-center text-[#DBD8C0] hover:text-white hover:bg-[#3B1635] transition-colors active:bg-[#FF8A00]/20"
              aria-label="Decrease quantity"
            >
              <Minus size={16} className="stroke-[2.5]" />
            </button>
            <span className="px-2 font-black text-sm text-[#FFF7EA] min-w-[24px] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-9 h-full flex items-center justify-center text-[#FF8A00] hover:text-white hover:bg-[#3B1635] transition-colors active:bg-[#FF8A00]/20"
              aria-label="Increase quantity"
            >
              <Plus size={16} className="stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
