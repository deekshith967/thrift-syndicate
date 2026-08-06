import { useState, useEffect } from 'react';
import { PRODUCTS as RAW_PRODUCTS } from './productsData';

const PRODUCTS_STORAGE_KEY = 'thrift_syndicate_products_v2';

/**
 * Normalizes a product object to ensure all standard schema fields are present.
 */
export function normalizeProduct(raw) {
  if (!raw) return null;
  const price = Number(raw.price) || 0;
  const originalPrice = Number(raw.originalPrice) || price;
  const discount = raw.discount ?? (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const images = Array.isArray(raw.images) && raw.images.length > 0 
    ? raw.images 
    : raw.image 
      ? [raw.image] 
      : ["/images/hero.png"];

  return {
    id: String(raw.id),
    name: raw.name || "Untitled Product",
    price: price,
    originalPrice: originalPrice,
    discount: discount,
    category: raw.category || "Uncategorized",
    subcategory: raw.subcategory || raw.category || "Vintage",
    brand: raw.brand || "Thrift Syndicate",
    size: raw.size || "Free Size",
    condition: raw.condition || "Pristine Thrift Condition",
    color: raw.color || "Multi",
    images: images,
    image: images[0],
    description: raw.description || "",
    featured: raw.featured ?? (raw.badge?.includes("Original") || raw.badge?.includes("Rare")),
    newArrival: raw.newArrival ?? true,
    inStock: raw.inStock ?? true,
    rating: Number(raw.rating) || 4.8,
    // Preserved vintage metadata
    badge: raw.badge || "1-of-1 Original",
    era: raw.era || "Vintage Classic",
    fabric: raw.fabric || "Cotton & Wool Blend",
    fit: raw.fit || "Vintage Oversized Fit",
  };
}

/**
 * Load products from localStorage or fall back to raw catalog dataset.
 */
function loadPersistedProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (err) {
    console.error('Error loading products from localStorage:', err);
  }
  return RAW_PRODUCTS.map(normalizeProduct);
}

/**
 * Save current mutable products array to localStorage.
 */
function persistProducts() {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mutableProducts));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
}

/**
 * Mutable list of products for CRUD operations (Single Source of Truth).
 */
let mutableProducts = loadPersistedProducts();

export const PRODUCTS = mutableProducts;

/**
 * Subscriber pattern for reactive state updates across the app.
 */
const subscribers = new Set();

export function subscribeToProducts(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers() {
  const currentProducts = getAllProducts();
  subscribers.forEach((callback) => callback(currentProducts));
}

/**
 * Custom React hook to consume reactive product state in components.
 */
export function useProducts() {
  const [products, setProducts] = useState(() => getAllProducts());

  useEffect(() => {
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });
    return unsubscribe;
  }, []);

  return products;
}

export function getAllProducts() {
  return [...mutableProducts];
}

/**
 * Add a new product to catalog.
 */
export function addProduct(newProductData) {
  const nextId = `ts-${String(mutableProducts.length + 1).padStart(3, '0')}`;
  const raw = {
    id: nextId,
    name: newProductData.name,
    category: newProductData.category || "Vintage Jackets",
    subcategory: newProductData.subcategory || newProductData.category,
    price: Number(newProductData.price) || 0,
    originalPrice: Number(newProductData.originalPrice) || Number(newProductData.price) || 0,
    size: newProductData.size || "M / L",
    condition: newProductData.condition || "9.5/10 Pristine Thrift Condition",
    brand: newProductData.brand || "Thrift Syndicate",
    badge: newProductData.badge || "New Drop",
    image: newProductData.image || "/images/jackets.png",
    images: newProductData.image ? [newProductData.image] : ["/images/jackets.png"],
    description: newProductData.description || "Handpicked vintage piece in great condition.",
    inStock: newProductData.inStock !== false,
    featured: Boolean(newProductData.featured),
    newArrival: true,
    rating: 5.0,
  };
  const normalized = normalizeProduct(raw);
  mutableProducts = [normalized, ...mutableProducts];
  persistProducts();
  notifySubscribers();
  return normalized;
}

/**
 * Update an existing product by ID.
 */
export function updateProduct(id, updatedFields) {
  const index = mutableProducts.findIndex((p) => String(p.id).toLowerCase() === String(id).toLowerCase());
  if (index === -1) return null;

  const current = mutableProducts[index];
  const mergedRaw = {
    ...current,
    ...updatedFields,
    price: Number(updatedFields.price ?? current.price),
    originalPrice: Number(updatedFields.originalPrice ?? current.originalPrice),
    image: updatedFields.image || current.image,
    images: updatedFields.image ? [updatedFields.image] : current.images,
  };

  const updated = normalizeProduct(mergedRaw);
  mutableProducts[index] = updated;
  persistProducts();
  notifySubscribers();
  return updated;
}

/**
 * Delete a product by ID.
 */
export function deleteProduct(id) {
  mutableProducts = mutableProducts.filter((p) => String(p.id).toLowerCase() !== String(id).toLowerCase());
  persistProducts();
  notifySubscribers();
  return true;
}

/**
 * Find product by ID.
 */
export function getProductById(id, products = mutableProducts) {
  if (!id) return null;
  return products.find((p) => String(p.id).toLowerCase() === String(id).toLowerCase()) || null;
}

/**
 * Find related products in the same category.
 */
export function getRelatedProducts(product, limit = 4, products = mutableProducts) {
  if (!product) return [];
  return products
    .filter((p) => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase())
    .slice(0, limit);
}

/**
 * Metadata extractors for filter options.
 */
export function getProductCategories(products = mutableProducts) {
  const set = new Set(products.map(p => p.category).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getProductBrands(products = mutableProducts) {
  const set = new Set(products.map(p => p.brand).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getProductSizes(products = mutableProducts) {
  const set = new Set(products.map(p => p.size).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getProductConditions(products = mutableProducts) {
  const set = new Set(products.map(p => p.condition).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getPriceBounds(products = mutableProducts) {
  if (!products || products.length === 0) return { minPrice: 0, maxPrice: 10000 };
  const prices = products.map(p => p.price);
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices)
  };
}

/**
 * Filter, search, sort, and paginate products.
 */
export function getFilteredProducts(products = mutableProducts, options = {}) {
  const {
    category = "All",
    brand = "All",
    size = "All",
    condition = "All",
    minPrice = 0,
    maxPrice = Infinity,
    search = "",
    sortBy = "newest", // 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'default'
    inStockOnly = false,
    page = 1,
    limit = 0, // 0 = no pagination limit
  } = options;

  let result = [...products];

  // Category filter
  if (category && category !== "All") {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Brand filter
  if (brand && brand !== "All") {
    result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }

  // Size filter
  if (size && size !== "All") {
    result = result.filter((p) => p.size.toLowerCase() === size.toLowerCase());
  }

  // Condition filter
  if (condition && condition !== "All") {
    result = result.filter((p) => p.condition.toLowerCase().includes(condition.toLowerCase()));
  }

  // Price Range filter
  if (minPrice > 0) {
    result = result.filter((p) => p.price >= minPrice);
  }
  if (maxPrice < Infinity && maxPrice > 0) {
    result = result.filter((p) => p.price <= maxPrice);
  }

  // In Stock filter
  if (inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  // Live Search filter
  if (search && search.trim() !== "") {
    const query = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
        (p.color && p.color.toLowerCase().includes(query)) ||
        (p.size && p.size.toLowerCase().includes(query))
    );
  }

  // Sorting
  if (sortBy === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "discount") {
    result.sort((a, b) => b.discount - a.discount);
  } else if (sortBy === "newest") {
    result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
  }

  // Pagination support
  const total = result.length;
  if (limit > 0) {
    const startIndex = (page - 1) * limit;
    result = result.slice(startIndex, startIndex + limit);
  }

  return result;
}

/**
 * Async API simulator for future backend integration.
 */
export async function fetchProductsApi(options = {}) {
  return getFilteredProducts(mutableProducts, options);
}
