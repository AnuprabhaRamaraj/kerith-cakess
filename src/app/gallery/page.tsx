"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Plus, Check, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { ProductModal } from "@/components/ProductModal";

export default function GalleryPage() {
  const { products } = useProducts();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const { addToCart, cart } = useCart();
  const [addedMap, setAddedMap] = useState<{ [id: string]: boolean }>({});

  const filterTabs = [
    { id: "all", label: "All Creations" },
    { id: "red-velvet", label: "Red Velvet" },
    { id: "black-forest", label: "Black Forest" },
    { id: "chocolate", label: "Chocolate Special" },
    { id: "custom", label: "Custom Models" },
    { id: "wedding", label: "Wedding Tiers" },
  ];

  const galleryItems = products.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.categoryId === selectedFilter;
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020001] pt-8 pb-24 text-[#FFF7EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B1635] text-[#C9A24A] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-[#FF8A00]" /> Freshly Baked Masterpieces
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-[#FFF7EA]">
            Our Cake <span className="gold-gradient-text">Gallery</span>
          </h1>
          <p className="text-sm text-[#DBD8C0] mt-2 leading-relaxed">
            Feast your eyes on our recent cake creations prepared for birthdays, weddings, anniversaries, and special moments in Coimbatore.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === tab.id
                  ? "orange-glow-btn text-white"
                  : "bg-[#241124] text-[#DBD8C0] border border-[#C9A24A]/20 hover:border-[#C9A24A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((product) => {
            const isAdded = addedMap[product.id];
            const inCart = cart.some((item) => item.product.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => setActiveModalProduct(product)}
                className="group relative rounded-3xl overflow-hidden bg-[#241124] border border-[#C9A24A]/25 hover:border-[#C9A24A] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl"
              >
                {/* Image Frame */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020001] via-[#020001]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#020001]/80 text-[#C9A24A] border border-[#C9A24A]/30 backdrop-blur-sm uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-xs font-black text-[#FF8A00] bg-[#020001]/90 px-3 py-1 rounded-full border border-[#FF8A00]/40">
                      ₹{product.offerPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xl ${
                        isAdded
                          ? "bg-[#C1DD13] text-[#020001]"
                          : "orange-glow-btn text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} /> Added
                        </>
                      ) : (
                        <>
                          <Plus size={16} /> Add to Order
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalProduct(product);
                      }}
                      className="p-2.5 rounded-xl bg-[#241124] border border-[#C9A24A] text-[#FFF7EA] hover:bg-[#3B1635]"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                {/* Content info below image */}
                <div className="p-5 flex items-center justify-between bg-[#241124]/90 border-t border-[#C9A24A]/15">
                  <div>
                    <h3 className="font-bold text-lg text-[#FFF7EA] group-hover:text-[#C9A24A] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#DBD8C0] mt-0.5">{product.weight}</p>
                  </div>

                  <span className="text-xs font-semibold text-[#FF8A00] underline">
                    {inCart ? "In Order Cart" : "View Cake"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}
