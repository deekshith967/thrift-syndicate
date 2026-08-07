import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useProducts, getProductById } from '../data/productService';
import { validateCoupon, calculateCouponDiscount, AVAILABLE_COUPONS } from '../data/couponService';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'thrift_syndicate_cart_v1';
const COUPON_STORAGE_KEY = 'thrift_syndicate_applied_coupon_v1';

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

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Error loading coupon from localStorage:', err);
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync lightweight raw cart state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(rawCartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [rawCartItems]);

  // Sync applied coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Error saving coupon to localStorage:', err);
    }
  }, [appliedCoupon]);

  // Dynamically map cart items against current products catalog
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
    const liveProd = getProductById(targetId, products);
    if (!liveProd || liveProd.stock <= 0) return;

    setRawCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => String(item.productId || item.product?.id || '') === targetId
      );
      if (existingIdx > -1) {
        const currentQty = prevItems[existingIdx].quantity;
        const newQty = Math.min(liveProd.stock, currentQty + quantity);
        const updated = [...prevItems];
        updated[existingIdx] = {
          productId: targetId,
          quantity: newQty,
        };
        return updated;
      }
      return [...prevItems, { productId: targetId, quantity: Math.min(liveProd.stock, quantity) }];
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
    const liveProd = getProductById(targetId, products);
    const maxStock = liveProd ? liveProd.stock : 99;
    const clampedQty = Math.min(maxStock, quantity);

    setRawCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.productId || item.product?.id || '') === targetId
          ? { productId: targetId, quantity: clampedQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setRawCartItems([]);
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const couponDiscount = useMemo(() => {
    return calculateCouponDiscount(appliedCoupon, subtotal);
  }, [appliedCoupon, subtotal]);

  const netSubtotal = useMemo(() => {
    return Math.max(0, subtotal - couponDiscount);
  }, [subtotal, couponDiscount]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 1999 ? 0 : 99;
  }, [subtotal]);

  const total = useMemo(() => {
    return netSubtotal + deliveryFee;
  }, [netSubtotal, deliveryFee]);

  const applyCoupon = (code) => {
    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
    }
    return result;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const value = {
    cartItems,
    cartCount,
    subtotal,
    couponDiscount,
    netSubtotal,
    deliveryFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons: AVAILABLE_COUPONS,
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
