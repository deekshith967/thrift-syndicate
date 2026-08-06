import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useProducts, getProductById } from '../data/productService';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'thrift_syndicate_cart_v1';

export function CartProvider({ children }) {
  const products = useProducts();

  const [rawCartItems, setRawCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync lightweight raw cart state (product IDs & quantities only) to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(rawCartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [rawCartItems]);

  // Dynamically map cart items against current products catalog (Single Source of Truth)
  const cartItems = useMemo(() => {
    return rawCartItems
      .map((item) => {
        const targetId = String(item.productId || item.product?.id || '');
        const currentProduct = getProductById(targetId, products);
        if (!currentProduct) return null; // Remove if product was deleted in admin
        return {
          product: currentProduct,
          quantity: Number(item.quantity) || 1,
        };
      })
      .filter(Boolean);
  }, [rawCartItems, products]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    const targetId = String(product.id);
    setRawCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => String(item.productId || item.product?.id || '') === targetId
      );
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx] = {
          productId: targetId,
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [...prevItems, { productId: targetId, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    const targetId = String(productId);
    setRawCartItems((prevItems) =>
      prevItems.filter((item) => String(item.productId || item.product?.id || '') !== targetId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    const targetId = String(productId);
    if (quantity <= 0) {
      removeFromCart(targetId);
      return;
    }
    setRawCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.productId || item.product?.id || '') === targetId
          ? { productId: targetId, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setRawCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const total = subtotal;

  const value = {
    cartItems,
    cartCount,
    subtotal,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
