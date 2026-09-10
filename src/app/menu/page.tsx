"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, BookOpen, ShoppingBag, MessageCircle, Sparkles } from "lucide-react";
import { PRODUCTS, FEATURED_CATEGORIES, Product } from "@/data/products";
import { CatalogueRow } from "@/components/CatalogueRow";
import { ProductModal } from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const { totalItemsCount, grandTotal, directOrderOnWhatsApp } = useCart();

  // Filtered Products
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
    <div className="min-h-screen bg-[#020001] pb-32 text-[#FFF7EA]">
      {/* Top Catalogue Sub-Header */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[#0a040b]/95 border-b border-[#3B1635]/90 backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back Arrow & Heading */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#241124] text-[#DBD8C0] hover:text-white border border-[#C9A24A]/30 transition-colors"
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white font-serif">
                Catalogue
              </h1>
              <p className="text-[10px] sm:text-xs text-[#C9A24A] font-medium">
                {filteredProducts.length} Cakes Available
              </p>
            </div>
          </div>

          {/* Right Actions: WhatsApp Catalogue link & Cart counter */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/c/916383558292"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#241124] border border-[#C9A24A]/30 text-[#C9A24A] hover:text-white transition-colors"
              title="Official WhatsApp Catalogue"
            >
              <BookOpen size={18} />
            </a>

            {totalItemsCount > 0 && (
              <button
                onClick={directOrderOnWhatsApp}
                className="orange-glow-btn px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5"
              >
                <ShoppingBag size={15} />
                <span>{totalItemsCount}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4">
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24A]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cake name, flavour..."
            className="w-full bg-[#120614] border border-[#3B1635] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#FFF7EA] placeholder-gray-500 focus:outline-none focus:border-[#FF8A00]"
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

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#FF8A00] text-white"
                : "bg-[#1f0d21] text-[#DBD8C0] border border-[#3B1635] hover:border-[#C9A24A]"
            }`}
          >
            All ({PRODUCTS.length})
          </button>
          {FEATURED_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const count = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#FF8A00] text-white"
                    : "bg-[#1f0d21] text-[#DBD8C0] border border-[#3B1635] hover:border-[#C9A24A]"
                }`}
              >
                {cat.name} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Vertically Scrolling Catalogue Cake List */}
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
            <p className="text-sm text-gray-400">No cakes found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#241124] text-xs font-bold text-[#FF8A00] border border-[#C9A24A]/30"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020001] p-12 text-center text-white">Loading catalogue...</div>}>
      <MenuContent />
    </Suspense>
  );
}
