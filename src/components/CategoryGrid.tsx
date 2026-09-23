"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Category } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";

interface CategoryGridProps {
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { exploreCategories, getImageSrc } = useProducts();

  return (
    <section className="py-16 bg-[#020001] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF8A00] tracking-wider uppercase mb-2">
              <Sparkles size={14} /> Delicious Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFF7EA] font-serif">
              Explore Our <span className="gold-gradient-text">Cake Categories</span>
            </h2>
            <p className="text-sm text-[#DBD8C0] mt-1 max-w-xl">
              From fresh cream delights to royal custom theme models, explore our handpicked categories.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C9A24A] hover:text-[#FF8A00] transition-colors"
          >
            <span>View Full Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {exploreCategories.map((cat: Category) => {
            const isSelected = selectedCategoryId === cat.id;

            const cardContent = (
              <div
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer h-44 sm:h-52 flex flex-col justify-end p-4 ${
                  isSelected
                    ? "border-[#FF8A00] ring-2 ring-[#FF8A00]/50 shadow-xl"
                    : "border-[#C9A24A]/20 hover:border-[#C9A24A]/70"
                }`}
              >
                {/* Background Image — cache-busted for admin-uploaded images */}
                <Image
                  src={getImageSrc(cat.image)}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized={cat.image.startsWith("data:")}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020001] via-[#020001]/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-bold text-base sm:text-lg text-[#FFF7EA] group-hover:text-[#FF8A00] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#DBD8C0] line-clamp-1 mt-0.5 font-normal">
                    {cat.description}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#C9A24A] group-hover:translate-x-1 transition-transform">
                    <span>Browse Cakes</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            );

            if (onSelectCategory) {
              return (
                <div key={cat.id} onClick={() => onSelectCategory(cat.id)}>
                  {cardContent}
                </div>
              );
            }

            return (
              <Link key={cat.id} href={`/menu?category=${cat.id}`}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
