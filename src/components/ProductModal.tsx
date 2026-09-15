"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, Star, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { Product, getProductPriceForWeight } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(product?.weight || "1 kg");
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [added, setAdded] = useState(false);

  // Sync weight when a new product is selected
  useEffect(() => {
    if (product) {
      setSelectedWeight(product.weight || "1 kg");
      setQuantity(1);
      setCustomNote("");
    }
  }, [product]);

  if (!product) return null;

  // Resolve dynamic price for the currently selected weight
  const currentPricing = getProductPriceForWeight(product, selectedWeight);
  const offerPrice = currentPricing.offerPrice;
  const originalPrice = currentPricing.originalPrice;

  const discountPercent =
    originalPrice > offerPrice
      ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity, customNote);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020001]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#241124] border border-[#C9A24A]/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#020001]/80 text-[#DBD8C0] hover:text-white border border-[#C9A24A]/30 transition-colors"
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        {/* Product Image Side */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto min-h-[280px] bg-[#020001]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized={product.image?.startsWith("data:") || product.image?.startsWith("http")}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241124] via-transparent to-transparent md:hidden" />
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-[#FF8A00] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {discountPercent}% OFF OFFER
            </div>
          )}
        </div>

        {/* Product Content Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#C9A24A] uppercase tracking-wider">
                {product.category}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1 text-[#FF8A00] text-xs font-bold">
                  <Star size={14} fill="#FF8A00" />
                  <span>{product.rating}</span>
                  <span className="text-[#DBD8C0]">({product.reviewsCount} reviews)</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-[#FFF7EA] font-serif">{product.name}</h2>

            <p className="text-xs text-[#DBD8C0] mt-2 leading-relaxed">{product.description}</p>

            {/* Price Section with Dynamic Updates */}
            <div className="mt-4 pt-4 border-t border-[#C9A24A]/20 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#FFF7EA] transition-all">
                ₹{offerPrice.toLocaleString("en-IN")}
              </span>
              {originalPrice > offerPrice && (
                <span className="text-sm text-[#DBD8C0]/60 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {originalPrice > offerPrice && (
                <span className="text-xs text-[#C1DD13] font-bold bg-[#C1DD13]/10 px-2 py-0.5 rounded border border-[#C1DD13]/30 ml-auto">
                  Save ₹{(originalPrice - offerPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Available Weight Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#FFF7EA]">
                  Select Cake Weight:
                </label>
                <span className="text-[11px] text-[#C9A24A] font-medium">
                  Price changes per weight
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableWeights?.map((w) => {
                  const weightPrice = getProductPriceForWeight(product, w);
                  const isSelected = selectedWeight === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#C9A24A] text-[#020001] border-[#C9A24A] shadow-md font-bold scale-105"
                          : "bg-[#3B1635] text-[#DBD8C0] border-[#C9A24A]/20 hover:border-[#C9A24A]"
                      }`}
                    >
                      <span>{w}</span>
                      <span className={`text-[10px] ${isSelected ? "text-black/80 font-bold" : "text-[#C9A24A]"}`}>
                        (₹{weightPrice.offerPrice})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Cake Message Note */}
            <div className="mt-4">
              <label className="text-xs font-bold text-[#FFF7EA] block mb-1">
                Custom Message on Cake (Optional):
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Happy Birthday Rahul!"
                className="w-full bg-[#020001]/60 border border-[#C9A24A]/30 rounded-xl px-3 py-2 text-xs text-[#FFF7EA] focus:outline-none focus:border-[#FF8A00]"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#C9A24A]/20 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#C9A24A]/40 rounded-xl bg-[#020001] px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  className="p-1 text-[#DBD8C0] hover:text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 font-bold text-sm text-[#FFF7EA]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 text-[#DBD8C0] hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  added
                    ? "bg-[#C1DD13] text-[#020001]"
                    : "orange-glow-btn text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Order!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add {selectedWeight} to Order (₹
                    {(offerPrice * quantity).toLocaleString("en-IN")})
                  </>
                )}
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#DBD8C0] pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#C1DD13]" /> 100% Fresh Cream Guarantee
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#FF8A00]" /> Same-day Coimbatore Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
