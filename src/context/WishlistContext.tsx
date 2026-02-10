import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/types/ecommerce";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => boolean;
  isWishlisted: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems(prev => prev.some(i => i.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const toggleItem = useCallback((product: Product): boolean => {
    let added = false;
    setItems(prev => {
      if (prev.some(i => i.id === product.id)) {
        return prev.filter(i => i.id !== product.id);
      }
      added = true;
      return [...prev, product];
    });
    return added;
  }, []);

  const isWishlisted = useCallback((productId: string) => {
    return items.some(i => i.id === productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isWishlisted, itemCount: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
