import React from 'react';
import { Filter, X, RotateCcw, Check, Tag, ShieldCheck, Shirt, DollarSign, Layers } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  brands = [],
  sizes = [],
  conditions = [],
  priceBounds = { minPrice: 0, maxPrice: 10000 },
  activeCategory = "All",
  onCategoryChange,
  selectedBrand = "All",
  onBrandChange,
  selectedSize = "All",
  onSizeChange,
  selectedCondition = "All",
  onConditionChange,
  priceRange = { min: 0, max: 10000 },
  onPriceRangeChange,
  inStockOnly = false,
  onInStockToggle,
  onResetFilters,
  activeFilterCount = 0,
  isMobile = false,
  onCloseMobile
}) {
  return (
    <div className={`bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-6 shadow-sm ${isMobile ? '' : 'sticky top-28'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-neutral-900" />
          <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-[#111111]">
            Refine Catalog
          </h3>
          {activeFilterCount > 0 && (
            <span className="bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold flex items-center gap-1 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-neutral-500 hover:text-black rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
          <Layers size={14} className="text-neutral-500" />
          <span>Category</span>
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange && onCategoryChange(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#111111] text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <span>{cat}</span>
                {isActive && <Check size={14} className="text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Filter */}
      {brands.length > 1 && (
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
            <Tag size={14} className="text-neutral-500" />
            <span>Brand / Style</span>
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange && onBrandChange(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#111111]"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Size Filter */}
      {sizes.length > 1 && (
        <div className="space-y-2.5 pt-2 border-t border-neutral-100">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
            <Shirt size={14} className="text-neutral-500" />
            <span>Size</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((sz) => {
              const isActive = selectedSize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => onSizeChange && onSizeChange(sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-[#111111] text-white border-black shadow-sm'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Condition Filter */}
      {conditions.length > 1 && (
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-neutral-500" />
            <span>Condition</span>
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => onConditionChange && onConditionChange(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#111111]"
          >
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 5. Price Range Filter */}
      <div className="space-y-3 pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
            <DollarSign size={14} className="text-neutral-500" />
            <span>Max Price</span>
          </label>
          <span className="text-xs font-mono font-bold text-[#111111]">
            ₹{priceRange.max.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min={priceBounds.minPrice || 0}
          max={priceBounds.maxPrice || 10000}
          step={100}
          value={priceRange.max}
          onChange={(e) =>
            onPriceRangeChange &&
            onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })
          }
          className="w-full accent-[#111111] cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>₹{priceBounds.minPrice.toLocaleString()}</span>
          <span>₹{priceBounds.maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* 6. In Stock Filter */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            In-Stock Items Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockToggle && onInStockToggle(e.target.checked)}
            className="w-4 h-4 text-[#111111] bg-neutral-100 border-neutral-300 rounded focus:ring-[#111111] cursor-pointer accent-[#111111]"
          />
        </label>
      </div>

    </div>
  );
}
