import { PRODUCTS as RAW_PRODUCTS } from './productsData';

/**
 * Normalizes a product object to ensure all standard schema fields are present.
 */
export function normalizeProduct(raw) {
  if (!raw) return null;
  const price = raw.price || 0;
  const originalPrice = raw.originalPrice || price;
  const discount = raw.discount ?? (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const images = Array.isArray(raw.images) && raw.images.length > 0 
    ? raw.images 
    : raw.image 
      ? [raw.image] 
      : ["/images/hero.png"];

  return {
    id: raw.id,
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
    rating: raw.rating ?? 4.8,
    // Preserved vintage metadata
    badge: raw.badge || "1-of-1 Original",
    era: raw.era || "Vintage Classic",
    fabric: raw.fabric || "Cotton & Wool Blend",
    fit: raw.fit || "Vintage Oversized Fit",
  };
}

/**
 * Normalized list of products.
 */
export const PRODUCTS = RAW_PRODUCTS.map(normalizeProduct);

/**
 * Find product by ID.
 */
export function getProductById(id, products = PRODUCTS) {
  if (!id) return null;
  return products.find((p) => String(p.id).toLowerCase() === String(id).toLowerCase()) || null;
}

/**
 * Find related products in the same category.
 */
export function getRelatedProducts(product, limit = 4, products = PRODUCTS) {
  if (!product) return [];
  return products
    .filter((p) => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase())
    .slice(0, limit);
}

/**
 * Metadata extractors for filter options.
 */
export function getProductCategories(products = PRODUCTS) {
  const set = new Set(products.map(p => p.category).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getProductBrands(products = PRODUCTS) {
  const set = new Set(products.map(p => p.brand).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getProductSizes(products = PRODUCTS) {
  const set = new Set(products.map(p => p.size).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getProductConditions(products = PRODUCTS) {
  const set = new Set(products.map(p => p.condition).filter(Boolean));
  return ["All", ...Array.from(set)];
}

export function getPriceBounds(products = PRODUCTS) {
  if (!products || products.length === 0) return { minPrice: 0, maxPrice: 10000 };
  const prices = products.map(p => p.price);
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices)
  };
}

/**
 * Filter, search, sort, and paginate products.
 * Prepares the codebase for seamless future backend integration.
 */
export function getFilteredProducts(products = PRODUCTS, options = {}) {
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
  return getFilteredProducts(PRODUCTS, options);
}
