import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useProducts, getProductById } from '../data/productService';
import { validateCoupon, calculateCouponDiscount, AVAILABLE_COUPONS } from '../data/couponService';
import { useCustomerAuth } from './CustomerAuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const products = useProducts();
  const customerAuth = useCustomerAuth();
  const customer = customerAuth?.customer || null;
  const currentCustomerId = customer?.id || null;

  // Dynamic customer-isolated storage keys
  const getCartKey = (id) => (id ? `thrift_syndicate_cart_${id}` : 'thrift_syndicate_cart_guest_v1');
  const getCouponKey = (id) => (id ? `thrift_syndicate_coupon_${id}` : 'thrift_syndicate_coupon_guest_v1');

  // Load initial cart state for active customer session
  const [rawCartItems, setRawCartItems] = useState(() => {
    try {
      const key = getCartKey(currentCustomerId);
      const saved = localStorage.getItem(key);
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
      const key = getCouponKey(currentCustomerId);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Error loading coupon from localStorage:', err);
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Keep track of previous customer ID to detect login, logout, or account switches
  const prevCustomerRef = useRef(currentCustomerId);

  useEffect(() => {
    if (prevCustomerRef.current !== currentCustomerId) {
      prevCustomerRef.current = currentCustomerId;

      // When customer logs out (becomes null), immediately clear active cart & coupon
      if (!currentCustomerId) {
        localStorage.removeItem('thrift_syndicate_cart_guest_v1');
        localStorage.removeItem('thrift_syndicate_coupon_guest_v1');
        setRawCartItems([]);
        setAppliedCoupon(null);
      } else {
        // When a customer logs in, restore ONLY that customer's isolated cart
        const cartKey = getCartKey(currentCustomerId);
        const couponKey = getCouponKey(currentCustomerId);
        try {
          const savedCart = localStorage.getItem(cartKey);
          setRawCartItems(savedCart ? JSON.parse(savedCart) : []);

          const savedCoupon = localStorage.getItem(couponKey);
          setAppliedCoupon(savedCoupon ? JSON.parse(savedCoupon) : null);
        } catch (err) {
          console.error('Error restoring customer cart:', err);
          setRawCartItems([]);
          setAppliedCoupon(null);
        }
      }
    }
  }, [currentCustomerId]);

  // Sync raw cart items to active customer's specific storage key
  useEffect(() => {
    const key = getCartKey(currentCustomerId);
    try {
      localStorage.setItem(key, JSON.stringify(rawCartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [rawCartItems, currentCustomerId]);

  // Sync applied coupon to active customer's specific storage key
  useEffect(() => {
    const key = getCouponKey(currentCustomerId);
    try {
      if (appliedCoupon) {
        localStorage.setItem(key, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.error('Error saving coupon to localStorage:', err);
    }
  }, [appliedCoupon, currentCustomerId]);

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
    const key = getCartKey(currentCustomerId);
    const couponKey = getCouponKey(currentCustomerId);
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(couponKey);
    } catch (err) {
      console.error('Error clearing cart storage:', err);
    }
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
    return calculateCouponDiscount(appliedCoupon, subtotal, customer);
  }, [appliedCoupon, subtotal, customer]);

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

  const applyCoupon = (code, explicitCustomer = null) => {
    const activeCustomer = explicitCustomer || customer || (() => {
      try {
        const saved = localStorage.getItem('thrift_syndicate_customer_auth_v1');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();
    const result = validateCoupon(code, subtotal, activeCustomer);
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
