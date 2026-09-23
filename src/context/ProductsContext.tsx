"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Category,
  PRODUCTS as INITIAL_PRODUCTS,
  FEATURED_CATEGORIES as INITIAL_FEATURED_CATEGORIES,
  EXPLORE_CATEGORIES as INITIAL_EXPLORE_CATEGORIES,
  getProductPriceForWeight,
} from "@/data/products";

// Extended product type with updatedAt for cache-busting
export interface ProductWithMeta extends Product {
  updatedAt?: number;
}

interface FeaturedCategory {
  id: string;
  name: string;
}

interface ProductsContextType {
  products: ProductWithMeta[];
  categories: FeaturedCategory[];         // FEATURED_CATEGORIES (filter tabs)
  exploreCategories: Category[];          // EXPLORE_CATEGORIES (homepage showcase)
  addProduct: (product: Omit<ProductWithMeta, "id">) => ProductWithMeta;
  updateProduct: (id: string, updatedFields: Partial<ProductWithMeta>) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleLive: (id: string) => void;
  resetToDefaults: () => void;
  getPriceForWeight: (
    product: Product,
    targetWeight?: string
  ) => { offerPrice: number; originalPrice: number };
  getImageSrc: (url: string, updatedAt?: number) => string;
  // Explore category management
  addExploreCategory: (cat: Omit<Category, "id">) => void;
  updateExploreCategory: (id: string, fields: Partial<Category>) => void;
  deleteExploreCategory: (id: string) => void;
  // Featured category (filter) management
  addFeaturedCategory: (cat: FeaturedCategory) => void;
  deleteFeaturedCategory: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = "kerith_cakes_custom_products_v2";
const EXPLORE_CATS_KEY = "kerith_explore_categories_v1";
const FEATURED_CATS_KEY = "kerith_featured_categories_v1";

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductWithMeta[]>(INITIAL_PRODUCTS);
  const [exploreCategories, setExploreCategories] = useState<Category[]>(INITIAL_EXPLORE_CATEGORIES);
  const [categories, setCategories] = useState<FeaturedCategory[]>(INITIAL_FEATURED_CATEGORIES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load all data from localStorage on mount
  useEffect(() => {
    try {
      // Products
      const savedProducts = localStorage.getItem(STORAGE_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }

      // Explore categories
      const savedExplore = localStorage.getItem(EXPLORE_CATS_KEY);
      if (savedExplore) {
        const parsed = JSON.parse(savedExplore);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExploreCategories(parsed);
        }
      }

      // Featured/filter categories
      const savedFeatured = localStorage.getItem(FEATURED_CATS_KEY);
      if (savedFeatured) {
        const parsed = JSON.parse(savedFeatured);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load data from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync products to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (err) {
        console.error("Failed to persist products to localStorage", err);
      }
    }
  }, [products, isLoaded]);

  // Sync explore categories to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(EXPLORE_CATS_KEY, JSON.stringify(exploreCategories));
      } catch (err) {
        console.error("Failed to persist explore categories to localStorage", err);
      }
    }
  }, [exploreCategories, isLoaded]);

  // Sync featured categories to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FEATURED_CATS_KEY, JSON.stringify(categories));
      } catch (err) {
        console.error("Failed to persist featured categories to localStorage", err);
      }
    }
  }, [categories, isLoaded]);

  // ── Product CRUD ──────────────────────────────────────────────────────────

  const addProduct = (newProd: Omit<ProductWithMeta, "id">): ProductWithMeta => {
    const id =
      newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    const created: ProductWithMeta = {
      ...newProd,
      id,
      isLive: newProd.isLive !== undefined ? newProd.isLive : true,
      rating: newProd.rating || 5.0,
      reviewsCount: newProd.reviewsCount || 12,
      updatedAt: Date.now(),
    };

    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = (id: string, updatedFields: Partial<ProductWithMeta>) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updatedFields, updatedAt: Date.now() }
          : item
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isBestseller: !item.isBestseller, updatedAt: Date.now() }
          : item
      )
    );
  };

  const toggleLive = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isLive: item.isLive === false ? true : false, updatedAt: Date.now() }
          : item
      )
    );
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setExploreCategories(INITIAL_EXPLORE_CATEGORIES);
    setCategories(INITIAL_FEATURED_CATEGORIES);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EXPLORE_CATS_KEY);
      localStorage.removeItem(FEATURED_CATS_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const getPriceForWeight = (product: Product, targetWeight?: string) => {
    return getProductPriceForWeight(product, targetWeight);
  };

  /**
   * Returns image src with cache-busting query param for server-side paths.
   * Base64 data URLs and external http URLs are returned as-is.
   */
  const getImageSrc = (url: string, updatedAt?: number): string => {
    if (!url) return url;
    // Base64 and external URLs: return as-is
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Local path: append cache-busting version param
    const version = updatedAt
      ? updatedAt.toString(36)
      : Date.now().toString(36);
    return `${url}?v=${version}`;
  };

  // ── Explore Category CRUD ────────────────────────────────────────────────

  const addExploreCategory = (cat: Omit<Category, "id">) => {
    const id = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 5);
    setExploreCategories((prev) => [...prev, { ...cat, id }]);
  };

  const updateExploreCategory = (id: string, fields: Partial<Category>) => {
    setExploreCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...fields } : c))
    );
  };

  const deleteExploreCategory = (id: string) => {
    const defaultIds = INITIAL_EXPLORE_CATEGORIES.map((c) => c.id);
    if (defaultIds.includes(id)) {
      alert("Default categories cannot be deleted. You can edit their image and description instead.");
      return;
    }
    setExploreCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Featured (Filter) Category CRUD ─────────────────────────────────────

  const addFeaturedCategory = (cat: FeaturedCategory) => {
    if (categories.find((c) => c.id === cat.id)) {
      alert("A category with this ID already exists.");
      return;
    }
    setCategories((prev) => [...prev, cat]);
  };

  const deleteFeaturedCategory = (id: string) => {
    if (id === "all") {
      alert('The "All Cakes" filter cannot be deleted.');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        exploreCategories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleLive,
        resetToDefaults,
        getPriceForWeight,
        getImageSrc,
        addExploreCategory,
        updateExploreCategory,
        deleteExploreCategory,
        addFeaturedCategory,
        deleteFeaturedCategory,
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
