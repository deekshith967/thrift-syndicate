import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useProducts, getProductById } from '../data/productService';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = 'thrift_syndicate_wishlist_v1';

export function WishlistProvider({ children }) {
  const products = useProducts();
  const { addToCart } = useCart();

  // Raw stored wishlist items: [{ productId: 'ts-001', addedAt: '2026-08-07T...' }]
  const [rawWishlist, setRawWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading wishlist from localStorage:', err);
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(rawWishlist));
    } catch (err) {
      console.error('Error saving wishlist to localStorage:', err);
    }
  }, [rawWishlist]);

  // Map raw items against products catalog. Supports orphan handling for deleted products.
  const wishlistItems = useMemo(() => {
    return rawWishlist.map((item) => {
      const targetId = String(item.productId || '');
      const product = getProductById(targetId, products);
      return {
        productId: targetId,
        addedAt: item.addedAt || new Date().toISOString(),
        product: product || null,
        isOrphan: !product,
      };
    });
  }, [rawWishlist, products]);

  // Valid active count (excluding orphan deleted items)
  const wishlistCount = useMemo(() => {
    return wishlistItems.filter((item) => !item.isOrphan).length;
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const targetId = String(productId);
    return rawWishlist.some((item) => String(item.productId) === targetId);
  };

  const addToWishlist = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setRawWishlist((prev) => {
      if (prev.some((item) => String(item.productId) === targetId)) {
        return prev;
      }
      return [{ productId: targetId, addedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    setRawWishlist((prev) => prev.filter((item) => String(item.productId) !== targetId));
  };

  const toggleWishlist = (productId) => {
    if (!productId) return false;
    const targetId = String(productId);
    const exists = isInWishlist(targetId);
    if (exists) {
      removeFromWishlist(targetId);
      return false; // Removed
    } else {
      addToWishlist(targetId);
      return true; // Added
    }
  };

  const moveToCart = (productId) => {
    if (!productId) return;
    const targetId = String(productId);
    const item = wishlistItems.find((i) => i.productId === targetId);
    if (item && item.product) {
      addToCart(item.product, 1);
      removeFromWishlist(targetId);
    }
  };

  const clearWishlist = () => {
    setRawWishlist([]);
  };

  const value = {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
