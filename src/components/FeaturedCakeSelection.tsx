"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { PRODUCTS, FEATURED_CATEGORIES, Product } from "@/data/products";
import { CatalogueRow } from "./CatalogueRow";
import { ProductModal } from "./ProductModal";

export const FeaturedCakeSelection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Filtered Products based on selected category chip & search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const categoryMatch =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const searchMatch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="featured-cakes" className="py-10 sm:py-16 bg-gradient-to-b from-[#020001] via-[#120614] to-[#020001] relative">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* 1. Section Heading: Featured Cake Selection */}
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8A00] tracking-wider uppercase mb-1">
            <Sparkles size={14} /> Fresh Cream Menu
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF7EA] font-serif">
            Featured <span className="gold-gradient-text">Cake Selection</span>
          </h2>
          <p className="text-xs text-[#DBD8C0] mt-0.5">
            Select cakes from any category below and click &ldquo;Order Now&rdquo; to send your order on WhatsApp.
          </p>
        </div>

        {/* 2. Category Filters:
            - Mobile: One horizontally scrollable row (overflow-x-auto, scrollbar-none, 320px touch friendly)
            - Desktop: Compact premium chips wrapping into multiple rows */}
        <div className="mb-4">
          <div className="flex md:flex-wrap items-center gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
            {FEATURED_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? PRODUCTS.length
                  : PRODUCTS.filter((p) => p.categoryId === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FF8A00] text-white shadow-md border border-[#FF8A00]"
                      : "bg-[#1f0d21] text-[#DBD8C0] border border-[#3B1635] hover:border-[#C9A24A]/60 hover:text-white"
                  }`}
                >
                  {cat.name} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Search Field */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24A]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within cakes (e.g. Red Velvet, Truffle, Brownie, Rasmalai)..."
            className="w-full bg-[#160b18] border border-[#3B1635] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#FFF7EA] placeholder-gray-500 focus:outline-none focus:border-[#FF8A00]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* 4. Filtered Cake-Product List (Compact Catalogue Rows) */}
        <div className="flex flex-col gap-2.5">
          {filteredProducts.map((product) => (
            <CatalogueRow
              key={product.id}
              product={product}
              onOpenDetails={(p) => setActiveModalProduct(p)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center bg-[#120614] rounded-2xl border border-[#3B1635] mt-4">
            <p className="text-sm text-gray-400">
              No cakes found in &ldquo;{selectedCategory}&rdquo; matching &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#241124] text-xs font-bold text-[#FF8A00] border border-[#C9A24A]/30"
            >
              Show All Cakes
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
};
