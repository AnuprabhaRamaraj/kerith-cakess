"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowLeft, BookOpen, ShoppingBag, MessageCircle, Sparkles } from "lucide-react";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { CatalogueRow } from "@/components/CatalogueRow";
import { ProductModal } from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { products, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const { totalItemsCount, grandTotal, directOrderOnWhatsApp } = useCart();

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isLiveMatch = product.isLive !== false;

      const categoryMatch =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const searchMatch =
        searchQuery.trim() === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return isLiveMatch && categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchQuery]);

  const liveProducts = products.filter((p) => p.isLive !== false);

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
              <p className="text-[11px] text-[#DBD8C0]">
                {filteredProducts.length} Cakes Available
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Order / Cart Indicator */}
          {totalItemsCount > 0 ? (
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="orange-glow-btn px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow"
              >
                <ShoppingBag size={14} />
                <span>
                  {totalItemsCount} ({`₹${grandTotal}`})
                </span>
              </Link>
              <button
                onClick={directOrderOnWhatsApp}
                className="p-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                title="Send Cart to WhatsApp"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          ) : (
            <a
              href="https://wa.me/c/916383558292"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#241124] border border-[#C9A24A]/40 text-xs text-[#C9A24A] font-semibold flex items-center gap-1 hover:border-[#FF8A00] transition-colors"
            >
              <MessageCircle size={14} className="text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp Catalogue</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4">
        {/* Search Input Bar */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24A]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cakes by name, flavour, or description..."
            className="w-full bg-[#150717] border border-[#3B1635] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#FFF7EA] placeholder-gray-500 focus:outline-none focus:border-[#FF8A00]"
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

        {/* Horizontal Scrollable Category Filter Chips */}
        <div className="flex md:flex-wrap items-center gap-1.5 overflow-x-auto md:overflow-visible pb-3 md:pb-0 mb-4 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? liveProducts.length
                : liveProducts.filter((p) => p.categoryId === cat.id).length;

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

export default function MenuPageClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020001] p-12 text-center text-white">Loading catalogue...</div>}>
      <MenuContent />
    </Suspense>
  );
}
