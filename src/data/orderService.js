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
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mutableOrders));
  } catch (err) {
    console.error('Error saving orders to localStorage:', err);
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

export function createOrder(orderData) {
  const id = orderData.orderId || `TS-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    id: id,
    customer: orderData.customer,
    items: orderData.items,
    subtotal: Number(orderData.subtotal) || 0,
    deliveryFee: Number(orderData.deliveryFee) || 0,
    total: Number(orderData.total) || Number(orderData.subtotal) || 0,
    paymentMethod: orderData.paymentMethod || "cod",
    status: orderData.status || "Pending",
    date: orderData.date || new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  mutableOrders = [newOrder, ...mutableOrders];
  persistOrders();
  notifySubscribers();
  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const index = mutableOrders.findIndex((o) => String(o.id).toLowerCase() === String(orderId).toLowerCase());
  if (index === -1) return null;

  mutableOrders[index] = {
    ...mutableOrders[index],
    status: newStatus
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
