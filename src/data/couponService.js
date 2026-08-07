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
    description: '15% OFF for first drop vintage shoppers',
  },
];

/**
 * Validates a promo coupon code against current cart subtotal.
 */
export function validateCoupon(code, subtotal = 0) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return { valid: false, error: 'Please enter a promo code.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, error: `Invalid promo code "${cleanCode}". Try VINTAGE10 or THRIFT200.` };
  }

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
export function calculateCouponDiscount(coupon, subtotal = 0) {
  if (!coupon || subtotal <= 0) return 0;
  if (subtotal < (coupon.minSpend || 0)) return 0;

  if (coupon.type === 'percentage') {
    return Math.round((subtotal * coupon.value) / 100);
  }
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal);
  }
  return 0;
}
