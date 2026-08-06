import React, { useState } from 'react';
import { CATEGORIES } from '../../data/productsData';
import { getFilteredProducts } from '../../data/productService';
import ProductGrid from './ProductGrid';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Collections({ onSelectProduct, onToggleSave, savedIds = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = getFilteredProducts(undefined, { category: activeCategory });

  return (
    <section id="collections" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              Handpicked Collections
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-[#111111]">
              Curated Vintage <span className="text-neutral-400 font-light italic">& Streetwear</span>
            </h2>
            <p className="text-neutral-600 max-w-xl text-base">
              Each piece is individually selected for quality fabric, authentic era character, and unmatched fit. When it’s gone, it’s gone.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-neutral-500">
              Showing {filteredProducts.length} Items
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-neutral-100">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Reusable Product Cards Grid */}
        <ProductGrid
          products={filteredProducts}
          onSelectProduct={onSelectProduct}
          onToggleSave={onToggleSave}
          savedIds={savedIds}
        />

        {/* Bottom Banner */}
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
