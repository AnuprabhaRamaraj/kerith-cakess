"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  PRODUCTS as INITIAL_PRODUCTS,
  FEATURED_CATEGORIES as INITIAL_CATEGORIES,
  getProductPriceForWeight,
} from "@/data/products";

interface ProductsContextType {
  products: Product[];
  categories: { id: string; name: string }[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleLive: (id: string) => void;
  resetToDefaults: () => void;
  getPriceForWeight: (
    product: Product,
    targetWeight?: string
  ) => { offerPrice: number; originalPrice: number };
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = "kerith_cakes_custom_products_v2";

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load customized products from localStorage if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load products from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (err) {
        console.error("Failed to persist products to localStorage", err);
      }
    }
  }, [products, isLoaded]);

  const addProduct = (newProd: Omit<Product, "id">): Product => {
    const id =
      newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    const created: Product = {
      ...newProd,
      id,
      isLive: newProd.isLive !== undefined ? newProd.isLive : true,
      rating: newProd.rating || 5.0,
      reviewsCount: newProd.reviewsCount || 12,
    };

    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBestseller: !item.isBestseller } : item
      )
    );
  };

  const toggleLive = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isLive: item.isLive === false ? true : false }
          : item
      )
    );
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const getPriceForWeight = (product: Product, targetWeight?: string) => {
    return getProductPriceForWeight(product, targetWeight);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleLive,
        resetToDefaults,
        getPriceForWeight,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
