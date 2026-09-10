"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
  customNote?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: string, quantity?: number, customNote?: string) => void;
  removeFromCart: (productId: string, selectedWeight: string) => void;
  updateQuantity: (productId: string, selectedWeight: string, delta: number) => void;
  setExactQuantity: (productId: string, selectedWeight: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  directOrderOnWhatsApp: () => boolean;
  getItemQuantity: (productId: string, selectedWeight?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "kerith_cakes_cart_v2";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (
    product: Product,
    selectedWeight?: string,
    quantity: number = 1,
    customNote?: string
  ) => {
    const weightToUse = selectedWeight || product.weight;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weightToUse
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (customNote) {
          updated[existingIndex].customNote = customNote;
        }
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedWeight: weightToUse,
            customNote,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, selectedWeight: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedWeight === selectedWeight)
      )
    );
  };

  const updateQuantity = (productId: string, selectedWeight: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedWeight === selectedWeight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const setExactQuantity = (productId: string, selectedWeight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedWeight);
      return;
    }
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId && item.selectedWeight === selectedWeight) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const getItemQuantity = (productId: string, selectedWeight?: string): number => {
    if (selectedWeight) {
      const item = cart.find(
        (i) => i.product.id === productId && i.selectedWeight === selectedWeight
      );
      return item ? item.quantity : 0;
    }
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear cart in localStorage", e);
    }
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const grandTotal = cart.reduce((sum, item) => {
    return sum + item.product.offerPrice * item.quantity;
  }, 0);

  // Generate and direct order on WhatsApp with full multi-item format
  const directOrderOnWhatsApp = (): boolean => {
    if (cart.length === 0) {
      alert("Please select at least one cake before ordering.");
      return false;
    }

    let orderItemsText = "";
    cart.forEach((item) => {
      const subtotal = item.product.offerPrice * item.quantity;
      orderItemsText += `Cake: ${item.product.name}
Weight/Description: ${item.selectedWeight}
Quantity: ${item.quantity}
Price: ₹${item.product.offerPrice.toLocaleString("en-IN")}
Subtotal: ₹${subtotal.toLocaleString("en-IN")}\n\n`;
    });

    const message = `Hello கேரித் Cakes,
I would like to place the following cake order:

ORDER DETAILS
${orderItemsText.trim()}

Total Items: ${totalItemsCount}
Estimated Total: ₹${grandTotal.toLocaleString("en-IN")}

Please confirm the availability and final order amount.
Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/916383558292?text=${encodedMessage}`;

    const win = window.open(whatsappUrl, "_blank");
    if (!win) {
      window.location.href = whatsappUrl;
    }
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setExactQuantity,
        clearCart,
        totalItemsCount,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        directOrderOnWhatsApp,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
