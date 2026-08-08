export const AVAILABLE_COUPONS = [
  {
    code: 'VINTAGE10',
    type: 'percentage', // 'percentage' | 'fixed'
    value: 10,
    minSpend: 1000,
    description: '10% OFF on vintage orders above ₹1,000',
  },
  {
    code: 'THRIFT200',
    type: 'fixed',
    value: 200,
    minSpend: 1500,
    description: 'Flat ₹200 OFF on orders above ₹1,500',
  },
  {
    code: 'VIZAG500',
    type: 'fixed',
    value: 500,
    minSpend: 3000,
    description: 'Flat ₹500 OFF on premium vintage drops above ₹3,000',
  },
  {
    code: 'FIRSTDROP',
    type: 'percentage',
    value: 15,
    minSpend: 0,
    firstOrderOnly: true,
    description: '15% OFF on your first vintage drop (First order only)',
  },
];

/**
 * Checks whether a given customer has already placed at least one successful order in the system.
 */
export function hasCustomerPlacedPriorOrders(customer = null) {
  try {
    const activeCustomer = customer || (() => {
      try {
        const saved = localStorage.getItem('thrift_syndicate_customer_auth_v1');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();

    const ordersJson = localStorage.getItem('thrift_syndicate_orders_v1');
    const allOrders = ordersJson ? JSON.parse(ordersJson) : [];
    if (!Array.isArray(allOrders) || allOrders.length === 0) {
      return false;
    }

    if (!activeCustomer) {
      return false;
    }

    const custEmail = String(activeCustomer.email || '').trim().toLowerCase();
    const custPhone = String(activeCustomer.phone || '').replace(/\D/g, '');
    const custId = String(activeCustomer.id || '');

    const hasPrior = allOrders.some((o) => {
      const isCancelled = String(o.status || '').toLowerCase() === 'cancelled';
      if (isCancelled) return false;

      const oEmail = String(o.customer?.email || '').trim().toLowerCase();
      const oPhone = String(o.customer?.phone || '').replace(/\D/g, '');
      const oCustId = String(o.customerId || '');

      if (custId && oCustId && oCustId === custId) return true;
      if (custEmail && oEmail && oEmail === custEmail) return true;
      if (custPhone && custPhone.length >= 7 && oPhone && oPhone === custPhone) return true;
      return false;
    });

    return hasPrior;
  } catch (err) {
    console.error('Error checking prior customer orders:', err);
    return false;
  }
}

/**
 * Validates a promo coupon code against current cart subtotal and customer order history.
 */
export function validateCoupon(code, subtotal = 0, customer = null) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return { valid: false, error: 'Please enter a promo code.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, error: `Invalid promo code "${cleanCode}". Try VINTAGE10 or THRIFT200.` };
  }

  // 1. First-Order-Only validation (FIRSTDROP)
  if (coupon.code === 'FIRSTDROP' || coupon.firstOrderOnly) {
    if (hasCustomerPlacedPriorOrders(customer)) {
      return {
        valid: false,
        coupon,
        error: 'FIRSTDROP can only be used on your first order.',
      };
    }
  }

  // 2. Minimum Spend constraint
  if (subtotal < coupon.minSpend) {
    return {
      valid: false,
      coupon,
      error: `Code "${coupon.code}" requires a minimum subtotal of ₹${coupon.minSpend.toLocaleString()}. (Current: ₹${subtotal.toLocaleString()})`,
    };
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon.type === 'fixed') {
    discountAmount = Math.min(coupon.value, subtotal);
  }

  return {
    valid: true,
    coupon: {
      ...coupon,
      code: coupon.code,
    },
    discountAmount,
    message: `Coupon "${coupon.code}" applied! Saved ₹${discountAmount.toLocaleString()}.`,
  };
}

/**
 * Recalculates discount for an already applied coupon object.
 */
export function calculateCouponDiscount(coupon, subtotal = 0, customer = null) {
  if (!coupon || subtotal <= 0) return 0;
  if (subtotal < (coupon.minSpend || 0)) return 0;

  if (coupon.code === 'FIRSTDROP' || coupon.firstOrderOnly) {
    if (hasCustomerPlacedPriorOrders(customer)) {
      return 0;
    }
  }

  if (coupon.type === 'percentage') {
    return Math.round((subtotal * coupon.value) / 100);
  }
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal);
  }
  return 0;
}
