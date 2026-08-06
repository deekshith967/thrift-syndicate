import { useState, useEffect } from 'react';

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
    deliveryFee: Number(orderData.deliveryFee) || 0,
    total: Number(orderData.total) || Number(orderData.subtotal) || 0,
    paymentMethod: String(orderData.paymentMethod || 'cod'),
    status: String(orderData.status || 'Pending'),
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
