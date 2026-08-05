import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/productsData';
import { Heart, Eye, ArrowRight, Sparkles, Filter, Check } from 'lucide-react';

export default function Collections({ onSelectProduct, onToggleSave, savedIds = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const isSaved = savedIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                    <span className="bg-[#111111] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      {product.badge}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-neutral-200">
                      {product.size}
                    </span>
                  </div>

                  {/* Top Right Save / Heart Button */}
                  <button
                    onClick={() => onToggleSave(product.id)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 shadow-md ${
                      isSaved
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-rose-500'
                    }`}
                    title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
                  >
                    <Heart size={16} className={isSaved ? "fill-white" : ""} />
                  </button>

                  {/* Hover Quick Action overlay button */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="w-full bg-white/95 hover:bg-white text-neutral-900 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      <Eye size={14} />
                      <span>Quick View & Details</span>
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>{product.category}</span>
                      <span className="font-mono text-[11px] text-neutral-400">{product.era}</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-[#111111] group-hover:text-neutral-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-xl text-[#111111]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-neutral-400 line-through font-mono">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-semibold uppercase">In-Store / Delivery</p>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="bg-neutral-100 hover:bg-[#111111] hover:text-white text-neutral-800 p-2.5 rounded-xl transition-colors"
                      title="Reserve or Inquire"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

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
