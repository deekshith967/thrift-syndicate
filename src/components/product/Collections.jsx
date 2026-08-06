import React, { useState, useMemo } from 'react';
import {
  PRODUCTS,
  getProductCategories,
  getProductBrands,
  getProductSizes,
  getProductConditions,
  getPriceBounds,
  getFilteredProducts
} from '../../data/productService';
import ProductGrid from './ProductGrid';
import FilterSidebar from './FilterSidebar';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, ArrowRight } from 'lucide-react';

export default function Collections({ onSelectProduct, onToggleSave, savedIds = [] }) {
  // Extract options metadata dynamically
  const categories = useMemo(() => getProductCategories(PRODUCTS), []);
  const brands = useMemo(() => getProductBrands(PRODUCTS), []);
  const sizes = useMemo(() => getProductSizes(PRODUCTS), []);
  const conditions = useMemo(() => getProductConditions(PRODUCTS), []);
  const priceBounds = useMemo(() => getPriceBounds(PRODUCTS), []);

  // Filter & Search States
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: priceBounds.minPrice, max: priceBounds.maxPrice });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== "All") count++;
    if (selectedBrand !== "All") count++;
    if (selectedSize !== "All") count++;
    if (selectedCondition !== "All") count++;
    if (priceRange.max < priceBounds.maxPrice) count++;
    if (inStockOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [activeCategory, selectedBrand, selectedSize, selectedCondition, priceRange, priceBounds, inStockOnly, searchQuery]);

  // Filtered & Sorted products using productService
  const filteredProducts = useMemo(() => {
    return getFilteredProducts(PRODUCTS, {
      category: activeCategory,
      brand: selectedBrand,
      size: selectedSize,
      condition: selectedCondition,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStockOnly,
      search: searchQuery,
      sortBy
    });
  }, [activeCategory, selectedBrand, selectedSize, selectedCondition, priceRange, inStockOnly, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSelectedBrand("All");
    setSelectedSize("All");
    setSelectedCondition("All");
    setPriceRange({ min: priceBounds.minPrice, max: priceBounds.maxPrice });
    setInStockOnly(false);
    setSearchQuery("");
    setSortBy("newest");
  };

  return (
    <section id="collections" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full inline-block">
              Handpicked Collections
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#111111]">
              Curated Vintage <span className="text-neutral-400 font-light italic">& Streetwear</span>
            </h2>
            <p className="text-neutral-600 max-w-xl text-base">
              Each piece is individually selected for quality fabric, authentic era character, and unmatched fit. When it’s gone, it’s gone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-neutral-500 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg">
              {filteredProducts.length} Items Found
            </span>
          </div>
        </div>

        {/* Toolbar: Live Search + Mobile Filter Toggle + Sorting */}
        <div className="bg-[#F8F8F8] border border-neutral-200/80 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Live Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search jacket, graphic tee, leather, oversize..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#111111]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Controls: Mobile Filter Button & Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-neutral-100 transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#111111] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-neutral-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-800 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
              >
                <option value="newest">Sort: Newest Drops</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

          </div>

        </div>

        {/* Main Catalog Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              categories={categories}
              brands={brands}
              sizes={sizes}
              conditions={conditions}
              priceBounds={priceBounds}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              selectedCondition={selectedCondition}
              onConditionChange={setSelectedCondition}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              inStockOnly={inStockOnly}
              onInStockToggle={setInStockOnly}
              onResetFilters={handleResetFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Product Grid Container */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={filteredProducts}
              onSelectProduct={onSelectProduct}
              onToggleSave={onToggleSave}
              savedIds={savedIds}
            />
          </div>

        </div>

        {/* Mobile Slide Drawer for Filters */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-4 shadow-2xl animate-fade-in">
              <FilterSidebar
                categories={categories}
                brands={brands}
                sizes={sizes}
                conditions={conditions}
                priceBounds={priceBounds}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                selectedBrand={selectedBrand}
                onBrandChange={setSelectedBrand}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                selectedCondition={selectedCondition}
                onConditionChange={setSelectedCondition}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                inStockOnly={inStockOnly}
                onInStockToggle={setInStockOnly}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
                isMobile={true}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-16 bg-[#F8F8F8] border border-neutral-200 rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto">
          <Sparkles size={24} className="mx-auto text-neutral-800" />
          <h3 className="font-display text-2xl font-bold text-[#111111]">Looking for Something Specific?</h3>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto">
            Our inventory refreshes weekly! DM us on Instagram or visit our store in Daba Gardens, Visakhapatnam to check out our secret unreleased drops.
          </p>
          <div className="pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Follow @thriftsyndicate on Instagram</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
