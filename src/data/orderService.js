import { useState, useEffect } from 'react';
import { deductProductStock } from './productService';

const ORDERS_STORAGE_KEY = 'thrift_syndicate_orders_v1';

// Initial sample orders for fresh installations
const DEFAULT_ORDERS = [
  {
    id: "TS-894210",
    customer: {
      fullName: "Rahul Sharma",
      phone: "+91 98480 12345",
      email: "rahul.sharma@example.com",
      address: "Door No. 12-4-15, MVP Colony, Sector 5",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      pincode: "530017"
    },
    items: [
      {
        product: {
          id: "ts-001",
          name: "90s Heavyweight Leather Biker Jacket",
          price: 3499,
          size: "L",
          category: "Vintage Jackets",
          image: "/images/hero.png"
        },
        quantity: 1
      }
    ],
    subtotal: 3499,
    deliveryFee: 0,
    total: 3499,
    paymentMethod: "cod",
    status: "Confirmed",
    date: "6 Aug 2026, 04:30 PM"
  },
  {
    id: "TS-542109",
    customer: {
      fullName: "Ananya Rao",
      phone: "+91 97039 88123",
      email: "ananya.rao@example.com",
      address: "Flat 202, Sun Towers, Siripuram",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      pincode: "530003"
    },
    items: [
      {
        product: {
          id: "ts-002",
          name: "Vintage Champion Reverse Weave Hoodie",
          price: 1899,
          size: "M",
          category: "Oversized Fits",
          image: "/images/hoodie.png"
        },
        quantity: 1
      }
    ],
    subtotal: 1899,
    deliveryFee: 99,
    total: 1998,
    paymentMethod: "upi",
    status: "Processing",
    date: "6 Aug 2026, 08:15 PM"
  }
];

function loadPersistedOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading orders from localStorage:', err);
  }
  return DEFAULT_ORDERS;
}

function persistOrders() {
  try {
    const jsonString = JSON.stringify(mutableOrders);
    localStorage.setItem(ORDERS_STORAGE_KEY, jsonString);

    // Verify write succeeded
    const verified = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!verified) {
      throw new Error('localStorage order verification failed.');
    }
  } catch (err) {
    console.error('Error saving orders to localStorage:', err);

    // Quota Recovery: If quota limit was reached, strip data URLs from all stored orders and retry
    if (err.name === 'QuotaExceededError' || err.code === 22 || err.number === -2147024882) {
      mutableOrders = mutableOrders.map((order) => ({
        ...order,
        items: (order.items || []).map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: item.product?.image?.startsWith('data:') ? '/images/hero.png' : item.product?.image,
          },
        })),
      }));

      try {
        localStorage.removeItem('thrift_syndicate_products_v1');
        localStorage.removeItem('thrift_syndicate_cart_v1');
        const retryJson = JSON.stringify(mutableOrders);
        localStorage.setItem(ORDERS_STORAGE_KEY, retryJson);
      } catch (retryErr) {
        console.error('Critical quota error: Unable to write orders to localStorage:', retryErr);
        throw retryErr;
      }
    } else {
      throw err;
    }
  }
}

let mutableOrders = loadPersistedOrders();

const subscribers = new Set();

export function subscribeToOrders(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers() {
  const currentOrders = getOrders();
  subscribers.forEach((callback) => callback(currentOrders));
}

export function useOrders() {
  const [orders, setOrders] = useState(() => getOrders());

  useEffect(() => {
    const unsubscribe = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });
    return unsubscribe;
  }, []);

  return orders;
}

export function getOrders() {
  return [...mutableOrders];
}

export function getOrderById(id) {
  if (!id) return null;
  return mutableOrders.find((o) => String(o.id).toLowerCase() === String(id).toLowerCase()) || null;
}

/**
 * Creates and persists a new order safely with 100% serializable lightweight product primitives.
 */
export function createOrder(orderData) {
  const id = String(orderData.orderId || `TS-${Math.floor(100000 + Math.random() * 900000)}`);

  // Store ONLY lightweight product references without embedding heavy Base64 image payloads
  const sanitizedItems = (orderData.items || []).map((item) => {
    const rawProd = item.product || {};
    let imgStr = typeof rawProd.image === 'string'
      ? rawProd.image
      : Array.isArray(rawProd.images) && typeof rawProd.images[0] === 'string'
        ? rawProd.images[0]
        : '/images/hero.png';

    // Replace heavy Base64 Data URL with lightweight fallback for JSON persistence.
    // The actual uploaded image is dynamically resolved via getProductById(productId) during rendering.
    if (imgStr.startsWith('data:')) {
      imgStr = '/images/hero.png';
    }

    return {
      product: {
        id: String(rawProd.id || 'ts-000'),
        name: String(rawProd.name || 'Untitled Vintage Item'),
        price: Number(rawProd.price) || 0,
        size: String(rawProd.size || 'Free Size'),
        category: String(rawProd.category || 'Vintage'),
        image: imgStr,
      },
      quantity: Number(item.quantity) || 1,
    };
  });

  const sanitizedCustomer = {
    fullName: String(orderData.customer?.fullName || ''),
    phone: String(orderData.customer?.phone || ''),
    email: String(orderData.customer?.email || ''),
    address: String(orderData.customer?.address || ''),
    city: String(orderData.customer?.city || 'Visakhapatnam'),
    state: String(orderData.customer?.state || 'Andhra Pradesh'),
    pincode: String(orderData.customer?.pincode || '530020'),
  };

  const newOrder = {
    id: id,
    customer: sanitizedCustomer,
    items: sanitizedItems,
    subtotal: Number(orderData.subtotal) || 0,
    couponDiscount: Number(orderData.couponDiscount) || 0,
    appliedCoupon: orderData.appliedCoupon ? {
      code: String(orderData.appliedCoupon.code || ''),
      discountAmount: Number(orderData.appliedCoupon.discountAmount) || 0
    } : null,
    deliveryFee: Number(orderData.deliveryFee) || 0,
    total: Number(orderData.total) || Number(orderData.subtotal) || 0,
    paymentMethod: String(orderData.paymentMethod || 'cod'),
    status: String(orderData.status || 'Pending'),
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    date: String(
      orderData.date ||
        new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
    ),
  };

  mutableOrders = [newOrder, ...mutableOrders];

  // Automatically deduct purchased quantities from single source of truth product inventory
  try {
    deductProductStock(sanitizedItems);
  } catch (err) {
    console.error('Failed to deduct product stock:', err);
  }

  // Guarantee persistence to localStorage before notifying subscribers or returning success
  persistOrders();

  notifySubscribers();
  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const index = mutableOrders.findIndex((o) => String(o.id).toLowerCase() === String(orderId).toLowerCase());
  if (index === -1) return null;

  mutableOrders[index] = {
    ...mutableOrders[index],
    status: String(newStatus)
  };
  persistOrders();
  notifySubscribers();
  return mutableOrders[index];
}

export function deleteOrder(orderId) {
  mutableOrders = mutableOrders.filter((o) => String(o.id).toLowerCase() !== String(orderId).toLowerCase());
  persistOrders();
  notifySubscribers();
  return true;
}

/**
 * Reusable analytics helper to compute revenue, order volume metrics, monthly charts, and product ranking.
 */
export function calculateOrderAnalytics(orders = []) {
  if (!Array.isArray(orders) || orders.length === 0) {
    return {
      totalRevenue: 0,
      todayRevenue: 0,
      monthRevenue: 0,
      previousMonthRevenue: 0,
      growthPercentage: 0,
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      averageOrderValue: 0,
      monthlyChartData: [],
      topSellingProducts: [],
      recentSales: []
    };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0=Jan, 7=Aug)
  const currentDate = now.getDate();

  // Create rolling 6-month array for charts
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const mIdx = d.getMonth();
    const y = d.getFullYear();
    monthlyMap.push({
      monthIndex: mIdx,
      year: y,
      shortLabel: monthNames[mIdx],
      fullLabel: `${monthNames[mIdx]} ${y}`,
      revenue: 0,
      orders: 0
    });
  }

  const parseOrderDate = (order) => {
    if (!order) return new Date();

    if (order.createdAt) {
      const parsed = new Date(order.createdAt);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    if (order.timestamp) {
      const parsed = new Date(order.timestamp);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    const dateStr = String(order.date || '').trim();
    if (!dateStr) return new Date();

    const directParsed = new Date(dateStr);
    if (!isNaN(directParsed.getTime())) return directParsed;

    const monthLookup = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    // Match "6 Aug 2026, 04:30 PM" or "8 Aug 2026" or "8-Aug-2026"
    const match1 = dateStr.match(/(\d{1,2})[\s\-\/]+([A-Za-z]{3,9})[\s\-\/,]+(\d{4})/);
    if (match1) {
      const d = parseInt(match1[1], 10);
      const mStr = match1[2].substring(0, 3).toLowerCase();
      const y = parseInt(match1[3], 10);
      if (monthLookup[mStr] !== undefined) {
        return new Date(y, monthLookup[mStr], d);
      }
    }

    // Match "Aug 8, 2026" or "August 8 2026"
    const match2 = dateStr.match(/([A-Za-z]{3,9})[\s\-\/]+(\d{1,2})[\s\-\/,]+(\d{4})/);
    if (match2) {
      const mStr = match2[1].substring(0, 3).toLowerCase();
      const d = parseInt(match2[2], 10);
      const y = parseInt(match2[3], 10);
      if (monthLookup[mStr] !== undefined) {
        return new Date(y, monthLookup[mStr], d);
      }
    }

    // Match "2026-08-08" or "2026/08/08"
    const match3 = dateStr.match(/(\d{4})[\-\/](\d{1,2})[\-\/](\d{1,2})/);
    if (match3) {
      return new Date(parseInt(match3[1], 10), parseInt(match3[2], 10) - 1, parseInt(match3[3], 10));
    }

    // Fallback to current date
    return new Date();
  };

  let totalRevenue = 0;
  let todayRevenue = 0;
  let validOrderCount = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;
  const productSalesMap = {};

  orders.forEach((order) => {
    const status = String(order.status || '').toLowerCase();
    const orderTotal = Number(order.total) || 0;

    if (status === 'pending') pendingOrders++;
    else if (status === 'delivered') deliveredOrders++;
    else if (status === 'cancelled') cancelledOrders++;

    const orderDate = parseOrderDate(order);
    const oYear = orderDate.getFullYear();
    const oMonth = orderDate.getMonth();
    const oDay = orderDate.getDate();

    // Map order to rolling monthly chart bucket
    let chartBucket = monthlyMap.find((b) => b.year === oYear && b.monthIndex === oMonth);
    if (!chartBucket) {
      chartBucket = monthlyMap[monthlyMap.length - 1];
    }

    if (chartBucket) {
      chartBucket.orders += 1;
    }

    if (status !== 'cancelled') {
      totalRevenue += orderTotal;
      validOrderCount++;

      if (oYear === currentYear && oMonth === currentMonth && oDay === currentDate) {
        todayRevenue += orderTotal;
      }

      if (chartBucket) {
        chartBucket.revenue += orderTotal;
      }

      // Aggregate product sales ranking
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const prod = item.product || {};
          const prodId = String(prod.id || item.productId || 'unknown');
          const qty = Number(item.quantity) || 1;
          const price = Number(prod.price) || 0;

          if (!productSalesMap[prodId]) {
            productSalesMap[prodId] = {
              id: prodId,
              name: prod.name || 'Vintage Item',
              image: prod.image || (Array.isArray(prod.images) ? prod.images[0] : '/images/hero.png'),
              category: prod.category || 'Vintage',
              price: price,
              totalSold: 0,
              revenueGenerated: 0
            };
          }
          productSalesMap[prodId].totalSold += qty;
          productSalesMap[prodId].revenueGenerated += price * qty;
        });
      }
    }
  });

  const averageOrderValue = validOrderCount > 0 ? Math.round(totalRevenue / validOrderCount) : 0;

  // Monthly summary & growth
  const currentMonthBucket = monthlyMap[monthlyMap.length - 1];
  const previousMonthBucket = monthlyMap[monthlyMap.length - 2];
  const monthRevenue = currentMonthBucket ? currentMonthBucket.revenue : 0;
  const previousMonthRevenue = previousMonthBucket ? previousMonthBucket.revenue : 0;

  let growthPercentage = 0;
  if (previousMonthRevenue > 0) {
    growthPercentage = Math.round(((monthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);
  } else if (monthRevenue > 0) {
    growthPercentage = 100;
  }

  // Top 5 selling products ranked by total sold
  const topSellingProducts = Object.values(productSalesMap)
    .sort((a, b) => b.totalSold - a.totalSold || b.revenueGenerated - a.revenueGenerated)
    .slice(0, 5);

  // Latest 5 orders
  const recentSales = orders.slice(0, 5).map((order) => ({
    id: order.id,
    customerName: order.customer?.fullName || 'Customer',
    total: Number(order.total) || 0,
    status: order.status || 'Pending',
    date: order.date || 'Recent',
    itemCount: Array.isArray(order.items)
      ? order.items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0)
      : 1
  }));

  return {
    totalRevenue,
    todayRevenue,
    monthRevenue,
    previousMonthRevenue,
    growthPercentage,
    totalOrders: orders.length,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    averageOrderValue,
    monthlyChartData: monthlyMap,
    topSellingProducts,
    recentSales
  };
}
