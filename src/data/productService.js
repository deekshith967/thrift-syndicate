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
 * Filter, search, sort, and paginate products.
 * Prepares the codebase for seamless future backend integration.
 */
export function getFilteredProducts(products = PRODUCTS, options = {}) {
  const {
    category = "All",
    search = "",
    sortBy = "default", // 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest'
    inStockOnly = false,
    page = 1,
    limit = 0, // 0 = no pagination limit
  } = options;

  let result = [...products];

  // Category filter
  if (category && category !== "All") {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // In stock filter
  if (inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  // Search filter
  if (search && search.trim() !== "") {
    const query = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(query)) ||
        (p.color && p.color.toLowerCase().includes(query))
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

  // Pagination
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
