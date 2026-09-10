"use client";

import React from "react";
import { CatalogueRow } from "./CatalogueRow";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  return <CatalogueRow product={product} onOpenDetails={onOpenDetails} />;
};
