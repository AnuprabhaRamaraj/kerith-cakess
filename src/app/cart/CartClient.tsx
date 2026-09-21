"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductPriceForWeight } from "@/data/products";

export default function CartClient() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    grandTotal,
    totalItemsCount,
    directOrderOnWhatsApp,
  } = useCart();

  const handleClearWithConfirm = () => {
    if (confirm("Are you sure you want to clear your selected cakes?")) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#020001] pt-6 pb-28 text-[#FFF7EA]">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#C9A24A] mb-4">
          <Link href="/menu" className="hover:underline flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Catalogue
          </Link>
          {cart.length > 0 && (
            <button
              onClick={handleClearWithConfirm}
              className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 size={13} /> Clear Selection
            </button>
          )}
        </div>

        <div className="mb-6 pb-3 border-b border-[#3B1635] flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#FFF7EA] flex items-center gap-2.5">
              <ShoppingBag size={24} className="text-[#FF8A00]" />
              Selected <span className="gold-gradient-text">Cake Order</span>
            </h1>
            <p className="text-xs text-[#DBD8C0] mt-0.5">
              கேரித் Cakes • MAKE A TEASTY LIFE
            </p>
          </div>

          {cart.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold border border-[#C9A24A]/30">
              {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-[#0d050f] border border-[#3B1635] shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#241124] border border-[#C9A24A]/30 flex items-center justify-center text-[#C9A24A] mx-auto">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#FFF7EA]">Your Cake Cart is Empty</h2>
            <p className="text-xs text-[#DBD8C0] max-w-sm mx-auto">
              Select your favourite fresh cream cakes or custom models from our menu and send your complete order on WhatsApp.
            </p>
            <div className="pt-2">
              <Link
                href="/menu"
                className="orange-glow-btn px-6 py-3 rounded-xl text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
              >
                <Sparkles size={16} />
                <span>Browse Cake Menu</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => {
                const pricing = getProductPriceForWeight(item.product, item.selectedWeight);
                const itemTotalPrice = pricing.offerPrice * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedWeight}`}
                    className="p-4 rounded-2xl bg-[#0d050f] border border-[#3B1635] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#241124] shrink-0 border border-[#C9A24A]/30">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          unoptimized={item.product.image?.startsWith("data:") || item.product.image?.startsWith("http")}
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-white truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#C9A24A]">
                            {item.selectedWeight}
                          </span>
                          <span className="text-xs text-[#DBD8C0]">
                            • ₹{pricing.offerPrice} each
                          </span>
                        </div>
                        {item.customNote && (
                          <p className="text-[11px] text-[#FF8A00] italic mt-1 truncate">
                            &ldquo;{item.customNote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#3B1635]">
                      <div className="flex items-center border border-[#C9A24A]/40 rounded-xl bg-[#020001] px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight, -1)}
                          className="p-1 text-[#DBD8C0] hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2.5 font-bold text-xs text-[#FFF7EA]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedWeight, 1)}
                          className="p-1 text-[#DBD8C0] hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <div className="font-black text-sm text-[#FFF7EA]">
                          ₹{itemTotalPrice.toLocaleString("en-IN")}
                        </div>
                        {pricing.originalPrice > pricing.offerPrice && (
                          <div className="text-[10px] text-[#DBD8C0]/50 line-through">
                            ₹{(pricing.originalPrice * item.quantity).toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Price & Direct WhatsApp Order Action */}
            <div className="p-5 rounded-2xl bg-[#150717] border border-[#C9A24A]/30 space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#3B1635] pb-3">
                <span className="text-sm font-bold text-[#DBD8C0]">Total Quantity:</span>
                <span className="text-base font-extrabold text-white">
                  {totalItemsCount} {totalItemsCount === 1 ? "Cake" : "Cakes"}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold text-[#FFF7EA]">Estimated Grand Total:</span>
                <span className="text-2xl font-black text-[#FF8A00]">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={directOrderOnWhatsApp}
                className="w-full orange-glow-btn py-3.5 rounded-xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <MessageCircle size={20} />
                <span>Order Now on WhatsApp</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-center text-[#DBD8C0]">
                Clicking will open WhatsApp with all {totalItemsCount} selected items, prices, and grand total included.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
