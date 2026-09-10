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

export default function CartPage() {
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
            <span className="bg-[#241124] text-[#C9A24A] border border-[#C9A24A]/30 px-3 py-1 rounded-full text-xs font-bold">
              {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="glass-card rounded-3xl p-10 text-center max-w-md mx-auto my-10 flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-[#3B1635] text-[#C9A24A]">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-bold text-[#FFF7EA]">No Cakes Selected Yet</h2>
            <p className="text-xs text-[#DBD8C0]">
              Browse our fresh cream cakes catalogue, select quantities, and click &ldquo;Order Now&rdquo; to send your order on WhatsApp.
            </p>
            <Link
              href="/menu"
              className="orange-glow-btn px-6 py-2.5 rounded-xl font-bold text-xs text-white mt-2 flex items-center gap-1.5"
            >
              <Sparkles size={16} />
              Open Catalogue
            </Link>
          </div>
        ) : (
          /* Selected Items List */
          <div className="space-y-4">
            <div className="flex flex-col gap-2.5">
              {cart.map((item, idx) => {
                const itemSubtotal = item.product.offerPrice * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedWeight}-${idx}`}
                    className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#0f0710] border border-[#3B1635]"
                  >
                    {/* Visual & Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#241124] shrink-0 border border-[#C9A24A]/25">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-white truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#DBD8C0]/70 truncate">
                          {item.selectedWeight} • ₹{item.product.offerPrice.toLocaleString("en-IN")} / cake
                        </p>
                        <p className="text-xs font-bold text-[#C9A24A] mt-0.5">
                          Subtotal: ₹{itemSubtotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Stepper & Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center h-10 bg-[#241124] border border-[#FF8A00] rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedWeight, -1)
                          }
                          className="w-8 h-full flex items-center justify-center text-[#DBD8C0] hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 font-black text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedWeight, 1)
                          }
                          className="w-8 h-full flex items-center justify-center text-[#FF8A00] hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedWeight)
                        }
                        className="p-2 text-gray-400 hover:text-red-400"
                        title="Remove"
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
